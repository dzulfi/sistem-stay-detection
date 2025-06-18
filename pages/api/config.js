import clientPromise from "../../lib/mongodb";
import { ObjectId } from 'mongodb'; // Import ObjectId

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("stay_detection"); // Pastikan nama database sesuai
  const collection = db.collection('camera_configs'); // Koleksi baru untuk konfigurasi kamera

  if (req.method === 'GET') {
    try {
      const configs = await collection.find({}).toArray();
      res.status(200).json(configs);
    } catch (error) {
      console.error('Failed to fetch camera configs:', error);
      res.status(500).json({ error: 'Failed to fetch camera configs' });
    }
  } else if (req.method === 'POST') {
    try {
      const newConfig = req.body;
      const result = await collection.insertOne(newConfig);
      res.status(201).json(result.ops[0]); // Mengembalikan dokumen yang baru dibuat
    } catch (error) {
      console.error('Failed to add camera config:', error);
      res.status(500).json({ error: 'Failed to add camera config' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { _id, ...updatedConfig } = req.body;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedConfig }
      );
      res.status(200).json({ message: 'Config updated', modifiedCount: result.modifiedCount });
    } catch (error) {
      console.error('Failed to update camera config:', error);
      res.status(500).json({ error: 'Failed to update camera config' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Config deleted', deletedCount: result.deletedCount });
    } catch (error) {
      console.error('Failed to delete camera config:', error);
      res.status(500).json({ error: 'Failed to delete camera config' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}