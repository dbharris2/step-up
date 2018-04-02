import DateDiff from 'date-diff';
import moment from 'moment-timezone';

export function getDateForYesterdaysSteps() {
  if (getLengthBetweenDates(getToday(), getEndOfCompetition()) > 0) {
    return getYesterday();
  } else {
    return getEndOfCompetition();
  }
}

export function getEndOfCompetition() {
  return "2018-05-20";
}

export function getLengthBetweenDates(start_date, end_date) {
  return (new DateDiff(new Date(end_date), new Date(start_date))).days();
}

export function getStartOfCompetition() {
  return "2018-04-01";
}

function getYesterday() {
  const yesterday = new moment.utc().subtract('31', 'hours').format('YYYY-MM-DD');
  console.log('Yesterday: ' + yesterday);
  return yesterday;
}

export function getToday() {
  const today = new moment.utc().subtract('7', 'hours').format('YYYY-MM-DD');
  console.log('Today: ' + today);
  return today;
}
