// pages/api/config.js
import clientPromise from "../../lib/mongodb";
import { ObjectId } from 'mongodb'; // Import ObjectId untuk operasi DELETE dan PUT
import { Cam } from "onvif/promises";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("stay_detection"); // Pastikan nama database sama dengan .env.local
  const collection = db.collection('cameras'); // Ganti nama koleksi menjadi 'cameras'

  if (req.method === 'GET') {
    try {
      const cameras = await collection.find({}).toArray();
      res.status(200).json(cameras);
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      res.status(500).json({ error: 'Failed to fetch cameras' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name_camera, username, password, ip_address, port } = req.body;
      if (!name_camera || !ip_address || !port) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // ONVIF camera
      let cam
      if (!username && !password) {
        cam = new Cam({ username: '', password: '', hostname: ip_address, port: port });
        console.log('benar')
        await cam.connect();
      } else {
        cam = new Cam({ username: username, password: password, hostname: ip_address, port: port })
        console.log('salah')
        await cam.connect();
      }

      const profile = cam.profiles[0];
      const stringUri = await cam.getStreamUri({ profileToken: profile.$.token, protocol: 'RTSP' })
      console.log(stringUri); // menampilkan hasil url RTSP tapi blm ada username dan password

      // menggabungkan username dan password menjadi url RTSP 
      const url = new URL(stringUri.uri);
      url.username = username;
      url.password = password;
      // hasil penggabungan
      const result_rtsp = url.href;

      // memasukkan dalam database
      const result = await collection.insertOne({ name_camera, username, password, ip_address, port, status: 'inactive', string_uri: result_rtsp }); // Tambahkan status awal
      res.status(201).json(result); // Return the inserted document
    } catch (error) {
      console.error('Failed to add camera:', error);
      res.status(500).json({ error: 'Failed to add camera' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { _id, name_camera, username, password, ip_address, port, ...rest } = req.body;

      if (!_id) {
        return res.status(400).json({ message: 'Missing camera ID' });
      }

      const updateData = { name_camera, username, password, ip_address, port, ...rest };

      // Cek apakah ip/port/username/password diberikan, jika ya maka update string_uri
      if (ip_address && port) {
        try {
          const cam = new Cam({
            username: username || '',
            password: password || '',
            hostname: ip_address,
            port: port
          });

          await cam.connect();
          const profile = cam.profiles[0];
          const stringUri = await cam.getStreamUri({
            profileToken: profile.$.token,
            protocol: 'RTSP'
          });

          const url = new URL(stringUri.uri);
          url.username = username || '';
          url.password = password || '';
          updateData.string_uri = url.href;
        } catch (onvifErr) {
          console.error('ONVIF update failed:', onvifErr.message);
          return res.status(400).json({ error: 'ONVIF connection failed' });
        }
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Camera not found' });
      }

      res.status(200).json({ message: 'Camera updated successfully' });

    } catch (error) {
      console.error('Failed to update camera:', error);
      res.status(500).json({ error: 'Failed to update camera' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Missing camera ID' });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Camera not found' });
      }
      res.status(200).json({ message: 'Camera deleted successfully' });
    } catch (error) {
      console.error('Failed to delete camera:', error);
      res.status(500).json({ error: 'Failed to delete camera' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}