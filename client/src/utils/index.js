function formatDate(date) {
    const pad = (number) => String(number).padStart(2, '0');
  
    const d = new Date(date);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1); // getMonth() returns 0-11
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
  
    var elapsed = current - previous;
  
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } 
    // else if (elapsed < msPerMonth) {
    //   return Math.round(elapsed / msPerDay) + " days ago";
    // } 
    // else if (elapsed < msPerYear) {
    //   return Math.round(elapsed / msPerMonth) + " months ago";
    // } 
    else {
      return formatDate(previous)
    }
  }

  export {formatDate, timeDifference}