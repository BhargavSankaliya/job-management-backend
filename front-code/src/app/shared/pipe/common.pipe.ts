import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Pipe({
  name: "sort"
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Pipe({
  name: 'niceDateFormat'
})
export class NiceDateFormatPipe implements PipeTransform {
  transform(value: any) {
    const valueData = new Date(value)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (valueData.getFullYear() == today.getFullYear() && valueData.getMonth() == today.getMonth() && valueData.getDate() == today.getDate()) {
      const time = new Date(value);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

      if (seconds < 60) {
        return 'just now';
      } else if (seconds < 3600) {
        return Math.floor(seconds / 60) + ' minutes ago';
      } else if (seconds < 86400) {
        return Math.floor(seconds / 3600) + ' hours ago';
      }
    }
    else if (valueData.getFullYear() == yesterday.getFullYear() && valueData.getMonth() == yesterday.getMonth() && valueData.getDate() == yesterday.getDate())
      return "Yesterday";
    else {
      return (new DatePipe("en-US")).transform(valueData, 'dd/MM/yyyy hh:mm:ss a');
    }

    return ''
  }

}

@Pipe({ name: 'keyValue' })
export class KeyValuePipe implements PipeTransform {
  transform(value: any): any {
    const keyValueArray: any[] = [];
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        keyValueArray.push({ key: key, value: value[key] });
      }
    }
    return keyValueArray;
  }
}


@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Customize this condition based on your requirements
      return JSON.stringify(item).toLowerCase().includes(searchText);
    });
  }
}
