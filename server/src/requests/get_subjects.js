import read_data from "../read_data.js";

export default function get_subjects(ws, input) {
    ws.send(JSON.stringify({
        request: 'get_subjects',
        data: read_data('./data/Subject.json').subjects,
        id: input.id,
    }));
}