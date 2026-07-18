/**
 * src/utils/travelRequestParser.js
 * Rule-based parser to extract travel preferences from natural language.
 */

// Mapping dictionary (without Vietnamese accents, lowercased)
const SEGMENT_KEYWORDS = {
  'sinh vien': 'Student',
  'hoc sinh': 'Student',
  'thanh nien': 'Student',
  'truong': 'Student',
  'lop': 'Student',
  'student': 'Student',

  'ban be': 'Young Professional',
  'nguoi yeu': 'Young Professional',
  'nguoi tre': 'Young Professional',
  'cap doi': 'Young Professional',
  'hai nguoi': 'Young Professional',
  'solo': 'Young Professional',
  'mot minh': 'Young Professional',
  'young professional': 'Young Professional',

  'gia dinh': 'Family',
  'vo chong': 'Family',
  'con nho': 'Family',
  'ca nha': 'Family',
  'bo me': 'Family',
  'ong ba': 'Family',
  'nguoi than': 'Family',
  'family': 'Family',

  'cong ty': 'Corporate',
  'dong nghiep': 'Corporate',
  'team building': 'Corporate',
  'doan the': 'Corporate',
  'phong ban': 'Corporate',
  'corporate': 'Corporate'
};

const TOUR_TYPE_KEYWORDS = {
  'bien': 'Beach',
  'dao': 'Beach',
  'tam bien': 'Beach',
  'nghi duong': 'Beach',
  'resort': 'Beach',
  'thieu nhi': 'Beach',
  'san ho': 'Beach',
  'beach': 'Beach',

  'van hoa': 'Cultural',
  'lich su': 'Cultural',
  'di tich': 'Cultural',
  'bao tang': 'Cultural',
  'lang nghe': 'Cultural',
  'chua': 'Cultural',
  'den': 'Cultural',
  'cultural': 'Cultural',

  'leo nui': 'Adventure',
  'trekking': 'Adventure',
  'cam trai': 'Adventure',
  'mao hiem': 'Adventure',
  'kham pha': 'Adventure',
  'rung': 'Adventure',
  'thac': 'Adventure',
  'phuot': 'Adventure',
  'adventure': 'Adventure',

  'thanh pho': 'City Break',
  'mua sam': 'City Break',
  'am thuc': 'City Break',
  'nightlife': 'City Break',
  'di choi': 'City Break',
  'dao pho': 'City Break',
  'city break': 'City Break'
};

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

function parseTravelRequest(text) {
  if (!text || typeof text !== 'string') {
    return {
      success: false,
      message: "Vui lòng nhập mô tả chuyến đi.",
      data: { cust_segment: null, tour_type: null, pax: null, budget_per_person_vnd: null },
      missing_fields: ['cust_segment', 'tour_type', 'pax', 'budget_per_person_vnd']
    };
  }

  // 1. Normalize
  let normalizedText = removeVietnameseTones(text).toLowerCase();
  // Remove special characters, keep letters and numbers
  normalizedText = normalizedText.replace(/[^\w\s\.]/g, ' ');
  normalizedText = normalizedText.replace(/\s+/g, ' ').trim();

  const data = {
    cust_segment: null,
    tour_type: null,
    pax: null,
    budget_per_person_vnd: null
  };

  // 2. Map cust_segment
  for (const [kw, val] of Object.entries(SEGMENT_KEYWORDS)) {
    if (normalizedText.includes(kw)) {
      data.cust_segment = val;
      break;
    }
  }

  // 3. Map tour_type
  for (const [kw, val] of Object.entries(TOUR_TYPE_KEYWORDS)) {
    if (normalizedText.includes(kw)) {
      data.tour_type = val;
      break;
    }
  }

  // 4. Extract Pax
  // Regex matches: 4 nguoi, 4 khach, nhom 4, gia dinh 4
  const paxMatch = normalizedText.match(/(\d+)\s*(nguoi|khach|thanh vien|nhan vien)/);
  if (paxMatch) {
    data.pax = parseInt(paxMatch[1], 10);
  } else {
    // Try matching numbers near "nhom", "gia dinh"
    const groupPaxMatch = normalizedText.match(/(nhom|gia dinh|doan)\s*(\d+)/);
    if (groupPaxMatch) {
      data.pax = parseInt(groupPaxMatch[2], 10);
    }
  }

  // 5. Extract Budget
  // Matches: 5 trieu, 5tr, 2.5 trieu, 2,5 trieu, 5000000 vnd, 5.000.000 dong, 800 nghin
  const millionMatch = normalizedText.match(/(\d+[\.,]?\d*)\s*(trieu|tr\b)/);
  if (millionMatch) {
    const val = parseFloat(millionMatch[1].replace(',', '.'));
    data.budget_per_person_vnd = Math.round(val * 1000000);
  } else {
    const thousandMatch = normalizedText.match(/(\d+)\s*(nghin|k\b)/);
    if (thousandMatch) {
      data.budget_per_person_vnd = parseInt(thousandMatch[1], 10) * 1000;
    } else {
      const vndMatch = normalizedText.match(/(\d+[\.\d]*)\s*(vnd|dong)/);
      if (vndMatch) {
        data.budget_per_person_vnd = parseInt(vndMatch[1].replace(/\./g, ''), 10);
      }
    }
  }

  // Check missing fields
  const missingFields = [];
  for (const key in data) {
    if (data[key] === null) {
      missingFields.push(key);
    }
  }

  return {
    success: true,
    message: missingFields.length > 0 ? "Some information could not be identified." : "Travel request parsed successfully.",
    data: data,
    missing_fields: missingFields
  };
}

module.exports = { parseTravelRequest };
