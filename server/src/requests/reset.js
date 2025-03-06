import fs from 'fs';

export default function reset() {
    fs.writeFile('./data/Appointment.json', JSON.stringify({ appointments: [] }), result => {});
    fs.writeFile('./data/Instructor.json', JSON.stringify({ instructors: [] }), result => {});
    fs.writeFile('./data/Student.json', JSON.stringify({ students: [] }), result => {});
    fs.writeFile('./data/Subject.json', JSON.stringify({ subjects: [] }), result => {});
}