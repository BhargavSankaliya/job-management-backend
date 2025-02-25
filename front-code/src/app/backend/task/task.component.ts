import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from './task.service';
import moment from 'moment'
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { NgIf } from '@angular/common';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterLink, TableDynamicComponent, NgIf, FormsModule, ReactiveFormsModule, SearchInputComponent, DropdownComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements AfterViewInit {
  headerData: any[] = [
    { key: 'jobNo', name: 'JOB NO.' },
    { key: 'counter', name: 'ESTIMATED COUNTER' },
    { key: 'partyName', name: 'PARTY NAME' },
    { key: 'jobName', name: 'JOB NAME' },
    { key: 'size', name: 'SIZE' },
    { key: 'operator', name: 'OPERATOR' },
    { key: 'date', name: 'DATE' },
    { key: 'taskPriority', name: 'PRIORITY' },
    { key: 'finalCounter', name: 'FINAL COUNTER' },
    { key: 'process', name: 'PROCESS' },
    { key: 'taskStatus', name: 'TASK STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allTaskList: any[] = [];
  taskList: any[] = [];

  startDatePicker: any;
  endDatePicker: any;
  p = 1;
  search: any = '';

  loginDetails: any

  dateObject = {
    startDate: moment().startOf('week').format("yyyy-MM-DD"),
    endDate: moment().endOf('week').format("yyyy-MM-DD")
  }

  constructor(public dialog: MatDialog, public taskService: TaskService, public router: Router) {
    this.dateObject = {
      startDate: moment().startOf('week').format("yyyy-MM-DD"),
      endDate: moment().endOf('week').format("yyyy-MM-DD")
    }
    this.getDate();
    this.loginDetails = getSessionData(StorageKey.LOGINDETAILS);
    console.log(this.loginDetails);

  }

  async getDate() {

    let date = await this.taskService.getDateFromDB();
    this.dateObject = date;

    this.getTaskList(false);
  }

  async saveDate(object: any) {

    let date = await this.taskService.saveDateInDB(object);
    this.dateObject = {
      startDate: moment(date.startDate).format("yyyy-MM-DD"),
      endDate: moment(date.endDate).format('yyyy-MM-DD')
    };

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {


  }

  searchFilter() {
    this.taskList = this.allTaskList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(this.search.toLocaleLowerCase()));
  }

  async getTaskList(force: boolean) {

    let object = {
      startDate: moment(this.dateObject.startDate).startOf('day').toDate(),
      endDate: moment(this.dateObject.endDate).endOf('day').toDate(),
    }

    let list: any = await this.taskService.getTaskList(force, object);
    if (list.length > 0) {


      this.allTaskList = list.map((x, i) => { return { ...x, date: moment(x.createdAt).format("DD/MM/yyyy"), srNo: i + 1, action: { edit: true, view: true, download: !!x.completedPicture ? true : false }, process: this.getCategoryString(x.category), taskPriority: x.taskPriority == 1 ? 'Low' : x.taskPriority == 2 ? 'Medium' : 'High' } })
      this.taskList = this.allTaskList;

      this.p = 1;
    }
    else {
      this.taskList = [];
      this.allTaskList = [];
    }

    this.saveDate(this.dateObject)

  }

  getCategoryString(category: any) {
    let processList: any = '';
    if (category && category.length > 0) {
      category.map((x, i) => {
        if (x.type == 'checkbox') {
          processList = processList + `<div>${i + 1}. ${x.name}</div>`
        }
        else {
          processList = processList + `<div>${i + 1}. ${x.name} ${x.value ? '- ' + x.value : ''}</div>`
        }
      })
    }
    return processList
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/task/list/update/" + event)
  }
  view(event: any) {
    this.router.navigateByUrl("/admin/task/list/view/" + event)
  }

  downloadExcel() {
    // Define static headers for non-category fields
    const baseHeaders = [
      { header: 'Job No.', key: 'jobNo', width: 20 },
      { header: 'Counter', key: 'counter', width: 20 },
      { header: 'Party Name', key: 'partyName', width: 30 },
      { header: 'Job Name', key: 'jobName', width: 30 },
      { header: 'Size', key: 'size', width: 30 },
      { header: 'Priority', key: 'taskPriority', width: 20 },
      { header: 'Status', key: 'taskStatus', width: 20 },
      { header: 'Assign User', key: 'userName', width: 30 },
      { header: 'Categories', key: 'categories', width: 60 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    // Extract unique category names to use as dynamic headers
    // const categoryNames = Array.from(
    //   new Set(
    //     this.taskList.flatMap(row => row.category?.map(cat => cat.name) || [])
    //   )
    // );

    // Create headers for categories
    // const categoryHeaders = categoryNames.map(name => ({
    //   header: name,
    //   key: name,
    //   width: 20,
    // }));

    // Combine all headers
    const headers = [...baseHeaders];

    // Map data dynamically based on headers
    const mappedData = this.taskList.map((row) => {
      const formattedRow: any = {};
      let taskName = "";

      if (row.category && row.category.length > 0) {
        row.category.map((a, i) => {
          if (i == 0) {
            taskName = a.name;
          }
          else {
            taskName = taskName + ", " + a.name;
          }
        })
      }

      headers.forEach((col) => {
        if (col.key === 'createdAt') {
          // Format the createdAt date
          formattedRow[col.header] = moment(row[col.key]).format("DD/MM/yyyy");
        } else if (col.key === 'categories') {
          formattedRow[col.header] = taskName;
        }
        else {
          // Map other keys
          formattedRow[col.header] = row[col.key] || '';
        }
      });

      return formattedRow;
    });

    // Create worksheet and apply column widths
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    worksheet['!cols'] = headers.map((col) => ({ wch: col.width }));

    // Create workbook and append worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate binary data and trigger download
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'DynamicExcel.xlsx');
  }

  environmentBaseUrl = environment.apiUrl;

  download(e: any) {
    let taskDetails = this.taskList.find((x) => x._id == e);

    this.downloadMyFile(this.environmentBaseUrl + 'uploads/completedPicture/' + taskDetails.completedPicture, taskDetails.completedPicture)
  }

  downloadMyFile(url: any, imageName: any) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    link.setAttribute('download', imageName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
