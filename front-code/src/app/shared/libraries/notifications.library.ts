// declare var $: any;
import * as $ from 'jquery';
import 'bootstrap-notify';

export function getNotificationGlyph(title: string): string {
  if (title) {
    switch (title.toLowerCase()) {
      case 'success':
        return 'alert-icon.svg';
        break;
      case 'error':
        return 'alert-icon-error.svg';
        break;
      case 'info':
        return 'fas fa-info-circle';
        break;
    }
  }
  return '<img src="../../../assets/alert-icon.svg" alt="alert-icon">';
}

export function getNotificationClass(title: string): string {
  if (title) {
    switch (title.toLowerCase()) {
      case 'success':
        return 'success';
        break;
      case 'error':
        return 'danger';
        break;
      case 'info':
        return 'info';
        break;
    }
  }

  return '';
}

export function notification(
  title: string,
  msg: string,
  duration: number,
  verticalPosition: string = 'top',
  horizontalPosition: string = 'right'
): void {

  $.notify(
    {
      // options
      icon: getNotificationGlyph(title),
      title: getNotificationGlyph(title),
      message: `${msg}`,
      url: null,
      target: null,
    },

    {
      // settings
      element: 'body',
      position: null,
      type: getNotificationClass(title),
      allow_dismiss: true,
      newest_on_top: true,
      showProgressbar: false,
      placement: {
        from: verticalPosition,
        align: horizontalPosition,
      },
      spacing: 10,
      z_index: 11111111,
      delay: duration,
      timer: 1000,
      url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated lightSpeedIn',
        exit: 'animated lightSpeedOut',
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: 'class',
      template:
        '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<img data-notify="icon" src="../../../assets/{1}" alt="alert-icon"> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>',
    });
}
