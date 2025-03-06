import read_data from "../read_data.js";

export default function get_instructors(ws, input) {
    ws.send(JSON.stringify({
        request: 'get_instructors',
        data: read_data('./data/Instructor.json').instructors,
        id: input.id,
    }));
}