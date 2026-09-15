import https from 'https';

const options = {
  hostname: 'secure.aitaxadvisers.com',
  path: '/secure-api/contact/list?limit=10',
  method: 'GET',
  headers: {
    'X-Public-ID': '339de287-7d5d-425e-a446-2af69f1de9a6',
    'X-Secret-Key': '$2y$13$BjkGgsk86v6F3XzWd7V7G.VV.czKl9QDe7b2Um0BD7KnM.dabGR3S',
    'Accept': 'application/json'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Success:', json.success);
      console.log('Total contacts:', json.data?.total);
      console.log('Sample Contacts:');
      (json.data?.result || []).forEach(c => {
        console.log(JSON.stringify({
          id: c.id,
          first_name: c.first_name,
          last_name: c.last_name,
          company: c.company_name,
          email: c.email,
          phone: c.phone,
          custom_fields: c.custom_fields
        }, null, 2));
      });
    } catch (e) {
      console.error(e, data);
    }
  });
});
req.end();
