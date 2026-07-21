const names = [
  'Ninh Kieu Wharf Can Tho', 'Cai Rang floating market Vietnam', 'Binh Thuy ancient house Can Tho',
  'Truc Lam Phuong Nam monastery', 'Con Son Can Tho Vietnam', 'Temple of Literature Hanoi',
  'Imperial Citadel of Thang Long', 'Imperial City Hue Vietnam', 'Thien Mu Pagoda Hue',
  'Hoi An Ancient Town Vietnam', 'Golden Bridge Ba Na Hills', 'Ben Thanh Market Saigon',
  'Ho Chi Minh City Museum of Fine Arts', 'Ba Den Mountain Tay Ninh', 'Tram Chim National Park Vietnam',
  'Sao Beach Phu Quoc', 'Phu Quoc Prison Vietnam', 'Ham Ninh fishing village Phu Quoc',
  'Cat Tien National Park Vietnam', 'Saigon Opera House Vietnam',
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  for (const name of names.slice(Number(process.env.START || 0))) {
    const params = new URLSearchParams({ action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '8', gsrsearch: name, prop: 'imageinfo', iiprop: 'url|size' });
    let response;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': 'TravelLensDataFix/1.0' } });
      if (response.ok) break;
      await wait(1500 * (attempt + 1));
    }
    const data = await response.json();
    const rows = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index)
      .filter((item) => /\.(jpe?g|png)$/i.test(item.title) && item.imageinfo?.[0]?.width >= 1000)
      .slice(0, 5).map((item) => ({ title: item.title, url: item.imageinfo[0].url, width: item.imageinfo[0].width, height: item.imageinfo[0].height }));
    console.log(JSON.stringify({ name, rows }));
    await wait(700);
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
