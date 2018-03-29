import DateDiff from 'date-diff';
import moment from 'moment-timezone';

export function formatDate(date_string) {
  const date = new Date(date_string);
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

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
  return (new DateDiff(new Date(end_date), new Date(start_date))).days() + 1;
}

export function getStartOfCompetition() {
  return "2018-03-20";
}

function getYesterday() {
  const yesterday = new moment.utc().subtract('31', 'hours').format('YYYY-MM-DD');
  console.log('Yesterday: ' + yesterday);
  return yesterday;
}

function getToday() {
  const today = new moment.utc().subtract('7', 'hours').format('YYYY-MM-DD');
  console.log('Today: ' + today);
  return today;
}
