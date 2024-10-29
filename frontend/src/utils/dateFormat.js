import moment from 'moment'


export const dateFormat = (date) =>{
    return moment(date).format('DD/MM/YYYY')  //before this the date looks like date string so we need to format in this way
}