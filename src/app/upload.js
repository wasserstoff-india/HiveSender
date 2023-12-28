import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    console.log('Sender:', fields.sender);

    // Here, you can add your logic to handle the CSV file

    res.status(200).json({ message: 'File uploaded successfully' });
  });
}
