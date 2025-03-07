import read_data from "../read_data.js";
import fs from 'fs';

export default function give_instructor_subject(ws, input) {
    let data = read_data('./data/Instructor.json').instructors;
    let index = data.findIndex(element => element.id === input.data.id);
    if (index === -1) { return; }
    data[index].subjects.push(input.data.subject);
    fs.writeFile('./data/Instructor.json', JSON.stringify({ instructors: data }), result => {});
    ws.send(JSON.stringify({
        request: 'gave_instructor_subject',
        data: input.data,
    }));
}