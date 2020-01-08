import moment from "moment";
import {dateFormatBackend} from 'config/constant';
moment.defaultFormat = dateFormatBackend;

class DateUtil {
    getDateByMonth(month, day) {
        month = this.formatDayMonthYear(month);
        day = day ? this.formatDayMonthYear(day) : "01";
        let year = moment().format('YYYY');
        return moment(`${year}-${month}-${day}`, dateFormatBackend).format()
    }

    formatDayMonthYear(input, length = -2) {
        input = '0000' + input;
        return input.slice(length);
    }
}
  
export default new DateUtil();
  