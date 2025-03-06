import fs from 'fs';
import read_data from "../read_data.js";

export default function create_instructor(ws, input) {
    let data = read_data('./data/Instructor.json').instructors;
    input.data.id = data.length == 0 ? 0 : data[data.length - 1].id + 1;
    data.push({
        name: input.data.name,
        subjects: input.data.subjects,
        id: input.data.id,
        image: input.data.image,
        color: input.data.color,
    });
    fs.writeFile('./data/Instructor.json', JSON.stringify({ instructors: data }), result => {});
    ws.send(JSON.stringify({
        request: 'created_instructor',
        data: input.data,
    }));
}