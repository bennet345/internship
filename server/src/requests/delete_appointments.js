import fs from 'fs';
import read_data from '../read_data.js';

export default function delete_appointments(ws, input) {
    let data = read_data('./data/Appointment.json').appointments;
    let new_data = [];
    for (let old of data) {
        if (! input.data.includes(old.id)) new_data.push(old);
    }
    fs.writeFile('./data/Appointment.json', JSON.stringify({ appointments: new_data }), result => {});
    ws.send(JSON.stringify({
        request: 'deleted_appointments',
        data: input.data,
    }));
}