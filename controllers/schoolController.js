const db = require('../db');

exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err });
    }
};

exports.listSchools = async (req, res) => {
    const { id, name, address, latitude, longitude } = req.query;

    try {
        let query = 'SELECT * FROM schools WHERE 1=1';
        const values = [];

        if(id){
            query += ' AND id = ? ';
            values.push(`${id}`);
        }
        if (name) {
            query += ' AND name LIKE ?';
            values.push(`%${name}%`);
        }

        if (address) {
            query += ' AND address LIKE ?';
            values.push(`%${address}%`);
        }

        if (!isNaN(parseFloat(latitude))) {
            query += ' AND latitude = ?';
            values.push(parseFloat(latitude));
        }

        if (!isNaN(parseFloat(longitude))) {
            query += ' AND longitude = ?';
            values.push(parseFloat(longitude));
        }

        const [results] = await db.execute(query, values);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err });
    }
};
