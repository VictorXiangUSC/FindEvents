export function getProperty(obj:any, level:any, ...rest:any):any {
  if(Array.isArray(obj)){
      if(obj.length == 0) return "";
      obj = obj[0];
  }
  if (obj === undefined) return "";
  if (rest.length == 0 && obj.hasOwnProperty(level)) return obj[level];
  let nextLevel = rest.shift();
  if(obj.hasOwnProperty(nextLevel)) return getProperty(obj[nextLevel], level, ...rest);
  return "";
}

export function compareDates(x:any,y:any):number
{
  let date1 = new Date(x.dates.start.localDate + " " + x.dates.start.localTime)
  let date2 = new Date(y.dates.start.localDate + " " + y.dates.start.localTime)
  let diff = date1.getTime() - date2.getTime();
  return diff;
}
