import fs from 'fs';
import read_data from "../read_data.js";

export default function create_appointment(ws, input) {
    let data = read_data('./data/Appointment.json').appointments;
    input.data.id = data.length === 0 ? 0 : data[data.length - 1].id + 1;
    data.push({
        id: input.data.id,
        subject: input.data.subject,
        instructor: input.data.instructor,
        date: input.data.date,
        time: input.data.time,
    });
    fs.writeFile('./data/Appointment.json', JSON.stringify({ appointments: data }), result => {});
    ws.send(JSON.stringify({
        request: 'created_appointment',
        data: input.data,
    }));
}