import fs from 'fs';
import read_data from "../read_data.js";

export default function create_subject(ws, input) {
    let data = read_data('./data/Subject.json').subjects;
    input.data.id = data.length === 0 ? 0 : data[data.length - 1].id + 1;
    data.push({
        name: input.data.name,
        id: input.data.id,
    });
    fs.writeFile('./data/Subject.json', JSON.stringify({ subjects: data }), result => {});
    ws.send(JSON.stringify({
        request: 'created_subject',
        data: input.data,
    }));
}