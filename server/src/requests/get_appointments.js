import read_data from "../read_data.js";

export default function get_appointments(ws, input) {
    ws.send(JSON.stringify({
        request: 'get_appointments',
        data: read_data('./data/Appointment.json').appointments,
        id: input.id,
    }));
}