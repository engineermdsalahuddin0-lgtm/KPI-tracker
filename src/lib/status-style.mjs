export function statusClass(status) {
  return {Completed:'status-completed','In progress':'status-progress',Pending:'status-pending',Reported:'status-progress','No Input':'status-no-input'}[status] || 'status-pending';
}
