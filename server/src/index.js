import { WebSocketServer } from 'ws';
import reset from './requests/reset.js';
import get_appointments from './requests/get_appointments.js';
import create_appointment from './requests/create_appointment.js';
import create_subject from './requests/create_subject.js';
import create_instructor from './requests/create_instructor.js';
import get_instructors from './requests/get_instructors.js';
import get_subjects from './requests/get_subjects.js';
import delete_appointments from './requests/delete_appointments.js';
import update_appointment from './requests/update_appointment.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log(`connection made`);

    ws.on('message', data => {
        let input = JSON.parse(data);
        console.log(input);
        switch (input.request) {
            case 'reset':               { reset(ws, input); break; }
            case 'get_instructors':     { get_instructors(ws, input); break; }
            case 'create_instructor':   { create_instructor(ws, input); break; }
            case 'get_subjects':        { get_subjects(ws, input); break; }
            case 'create_subject':      { create_subject(ws, input); break; }
            case 'create_appointment':  { create_appointment(ws, input); break; }
            case 'get_appointments':    { get_appointments(ws, input); break; }
            case 'delete_appointments': { delete_appointments(ws, input); break; }
            case 'update_appointment':  { update_appointment(ws, input); break; }
            default: break;
        }
    });
});