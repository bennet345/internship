import fs from 'fs';

export default function read_data (name) {
    let object = JSON.parse(fs.readFileSync(name, 'utf8'));
    return object;
}