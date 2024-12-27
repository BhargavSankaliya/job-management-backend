/*
*All common directives
*Note : On add new directive please add it in directives.module.ts file also
*/
import { Directive, HostListener, Input, Output, EventEmitter, ElementRef } from '@angular/core';
declare const $: any;


/*
*For prevent to type all except 1 to 9 and backspace,etc
*/
@Directive({ selector: '[appNumbersOnly]' })
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    // Allow: backspace, delete, tab, escape, enter and . (110 for . which is removed)
    if ([46, 8, 9, 27, 13, 190, 116].indexOf(e.keyCode) !== -1 ||
      (e.keyCode == 65 && e.ctrlKey === true) ||
      (e.keyCode == 67 && e.ctrlKey === true) ||
      (e.keyCode == 86 && e.ctrlKey === true) ||
      (e.keyCode == 116 && e.ctrlKey === true) ||
      (e.keyCode == 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}

@Directive({
  selector: '[appConfirm]'
})
export class ConfirmDirective {
  @Input() confirmTitle: string = "Confirm!";
  @Input() confirmContent: string = "Are you sure?";
  @Output('confirm-click') click: any = new EventEmitter();

  @HostListener('click', ['$event']) clicked(e: any) {

    // var confirmModal = document.createElement('div');
    // confirmModal.innerHTML = '<div class="modal fade delete-modal" tab-index="-1" role="dialog" id="Deletemodal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" class="btn-close"  aria-label="Close"></button></div><div class="modal-body"><form><div class="row"><p>Are you sure you want to delete the <span class="fontw600">${this.confirmTitle} ?</span></p><p>${this.confirmContent}</p></div></form></div><div class="modal-footer"><button type="submit" class="border-btn">Yes</button><button type="submit" class="primary-btn" data-dismiss="modal">No</button></div></div></div></div>'

    // const yesButton: any = confirmModal.querySelector('.border-btn');
    // yesButton.addEventListener('click', () => {
    //   this.click.emit(); // Emit the confirm-click event
    //   document.body.removeChild(confirmModal); // Remove the modal from DOM
    // });

    // const noButton: any = confirmModal.querySelector('.primary-btn');
    // noButton.addEventListener('click', () => {
    //   document.body.removeChild(confirmModal); // Remove the modal from DOM
    // });

    // document.body.appendChild(confirmModal);

    $.confirm({
      title: this.confirmTitle,
      content: this.confirmContent,
      buttons: {
        yes: () => this.click.emit(),
        no: () => { }
      }
    });
  }

}


@Directive({
  selector: '[trim]',
})
export class TrimDirective {
  constructor(private el: ElementRef) { }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    this.el.nativeElement.value = value.trim();
  }
}