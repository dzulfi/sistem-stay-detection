// pages/api/logs.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(); // default: stay_detection
    const collection = db.collection('log_stay');
    // console.log(collection)

    const logs = await collection.find({}).toArray();

    res.status(200).json(logs);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
