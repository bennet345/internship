import read_data from "../read_data.js";
import fs from 'fs';

export default function update_appointment(ws, input) {
    let data = read_data('./data/Appointment.json').appointments;
    let index = data.findIndex(element => element.id === input.data.id);
    if (index === -1) { return; }
    data[index] = {
        id: input.data.id,
        subject: input.data.subject,
        instructor: input.data.instructor,
        date: input.data.date,
        time: input.data.time,
    };
    fs.writeFile('./data/Appointment.json', JSON.stringify({ appointments: data }), result => {});
    ws.send(JSON.stringify({
        request: 'updated_appointment',
        data: input.data,
    }));
}