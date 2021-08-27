import acid from "../lib/acid";
import convertGeo from "../lib/convertGeo";
import orderId from "../lib/orderId";

// const { v4: uuidv4 } = require("uuid");
const pool = require("../db/config");
const sha1 = require("node-sha1");
// @ts-ignore
const { getDateStr } = require("../utils/formatConverter");
const convertBugoFormat = require("../lib/convertBugoFormat");

const limitCnt = 15;

const getSangjuRelationByInfo = async (name, phone) => {
  try {
    const where = `where wr_1 like '%"wr_1_name":"${name}","wr_1_tel":"${phone}"%' and wr_delete=0`;
    console.log("@ getSangjuRel\n", where);
    const query = `select wr_1 as sangjus from g5_write_bugo ${where}`;

    const [result, _] = await pool.query(query);

    if (result.length === 0) return null;
    console.log("@ sangjus\n", result);
    const selected = JSON.parse(result[0].sangjus).filter(
      (s) => s.wr_1_name === name && s.wr_1_tel === phone
    );
    console.log("@ selected : ", selected);
    if (selected.length === 0) return null;
    return selected[0].wr_1_type;
  } catch (e) {
    console.log("#ERROR in db.getSangjuRelationByInfo\n", e);
    return false;
  }
};

const authToken = async (token) => {
  try {
    const query = `select mb_no from g5_member where mb_8='${token}'`;
    const [result, _] = await pool.query(query);
    console.log("@@ ", result);
    return !!result.length;
  } catch (e) {
    console.log("#ERROR in db.authToken\n", e);
    return false;
  }
};
const getUidByToken = async (token) => {
  try {
    const query = `select mb_id as uid from g5_member where mb_8='${token}'`;
    const [result, _] = await pool.query(query);
    return result[0]?.uid || null;
  } catch (e) {
    console.log("#ERROR in db.getUidByToken\n", e);
    return null;
  }
};
const getUserByInfo = async (info) => {
  try {
    const query = `select mb_no as no, mb_id as uid, mb_name as name, mb_hp as phone, mb_level as level, mb_3 as code from g5_member where mb_name='${info.name}' and mb_hp='${info.phone}'`;
    const [result, _] = await pool.query(query);

    return result[0] ?? null;
  } catch (e) {
    console.log("#ERROR in db.getUserByInfo\n", e);
    return null;
  }
};
const getInfoByToken = async (token) => {
  try {
    const query = `select mb_name as name, mb_hp as phone, mb_level as level, mb_id as uid, mb_3 as code, mb_dupinfo as primaryValue from g5_member where mb_8='${token}' and mb_leave_date=''`;
    const [result, _] = await pool.query(query);
    return result[0] || null;
  } catch (e) {
    console.log("#ERROR in db.getInfoByToken\n", e);
    return null;
  }
};
const getTypeByToken = async (token) => {
  try {
    const query = `select mb_level from g5_member where mb_8='${token}' and mb_leave_date=''`;
    const [result, _] = await pool.query(query);
    return result[0]?.mb_level || 0;
  } catch (e) {
    console.log("#ERROR in db.getTypeByToken\n", e);
    return null;
  }
};
const getAppliedSangju = async (bugoId) => {
  try {
    const query = `
    select 
      odid.od_id as odid, p.name, p.hp as phone, p.account_name as accountName, p.account_bank as accountBank, p.account_number as accountNum,
      p.wr_id as bugoId
    from 
      (select od_id from g5_shop_order where wr_id='${bugoId}' and od_type=2 and od_status!='주문') as odid
      inner join custom_price as p on odid.od_id=p.od_id
    `;

    const [result, _] = await pool.query(query);
    let realResult = [];
    for (const r of result) {
      const query = `select wr_1 as sangjus from g5_write_bugo where wr_id=${r.bugoId}`;

      const [result, _] = await pool.query(query);
      const arrSangju = JSON.parse(result[0].sangjus);
      console.log(arrSangju);
      const matchedSangju = arrSangju.find(
        (s) => s.wr_1_name === r.name && s.wr_1_tel === r.phone
      );
      realResult.push({
        ...r,
        relation: matchedSangju?.wr_1_type || "",
      });
    }
    console.log(realResult);
    // result.map((r) => {
    //   a;
    // });

    return realResult || [];
  } catch (e) {
    console.log("#ERROR in db.getNamePhoneByToken\n", e);
    return [];
  }
};
const getAppliedLogByOdid = async (odid) => {
  try {
    const query = `
    select 
      account_name as accountName,
      account_bank as accountBank,
      account_number as accountNum,
      name as sangju
    from custom_price
    where od_id='${odid}'
    `;

    const [result, _] = await pool.query(query);

    return result[0] || null;
  } catch (e) {
    console.log("#ERROR in db.getNamePhoneByToken\n", e);
    return null;
  }
};

const getCalcAccountByToken = async (token) => {
  try {
    const query = `
    select 
      mb_4 as name,
      mb_5 as bank,
      mb_6 as num
    from g5_member
    where mb_8='${token}'
    `;

    const [result, _] = await pool.query(query);

    return result[0] || { name: "", bank: "", num: "" };
  } catch (e) {
    console.log("#ERROR in db.getCalcAccountByToken\n", e);
    return { name: "", bank: "", num: "" };
  }
};

const getBugoList = async ({ page, searchKeyword }) => {
  try {
    const whereSearch = searchKeyword
      ? `and (wr_2 like ('%${searchKeyword}%') or wr_1 like ('%${searchKeyword}%'))`
      : "";

    const paging = page ? `limit ${limitCnt} offset ${(page - 1) * 10}` : "";
    const query = `select wr_12 as xy, wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and wr_delete=0 ${whereSearch} order by wr_datetime desc ${paging} `;

    const [result, _] = await pool.query(query);
    return result.map(convertBugoFormat);
  } catch (e) {
    console.log("#ERROR in db.getBugoList\n", e);
    return [];
  }
};
const getBugoById = async (bugoId) => {
  try {
    const query = `select wr_12 as xy, wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and wr_delete=0 and wr_id=${bugoId}`;
    const [result, _] = await pool.query(query);
    return result.map(convertBugoFormat);
  } catch (e) {
    console.log("#ERROR in db.getBugoById\n", e);
    return [];
  }
};
const getBugoByWriter = async (writer) => {
  try {
    const query = `select wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and mb_id='${writer}' and wr_delete=0`;
    const [result, _] = await pool.query(query);
    return result.map(convertBugoFormat);
  } catch (e) {
    console.log("#ERROR in db.getBugoByWriter\n", e);
    return [];
  }
};
const getBugoIdByWriter = async (writer) => {
  try {
    const query = `select wr_id as id from g5_write_bugo where wr_is_comment=0 and mb_id='${writer}' and wr_delete=0`;
    const [result, _] = await pool.query(query);
    return result.map(convertBugoFormat);
  } catch (e) {
    console.log("#ERROR in db.getBugoByWriter\n", e);
    return [];
  }
};
const getBugoByInfo = async (name, phone, uid, page) => {
  try {
    const info = JSON.stringify({
      wr_1_name: name,
      wr_1_tel: phone,
    });

    const pageQuery = page ? `limit ${limitCnt} offset ${(page - 1) * 10}` : "";
    const query = `select wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_12 as xy, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo 
    where 
      (wr_is_comment=0) and 
      (wr_delete=0) and 
      (wr_1 like '%${info.substring(
        1,
        info.length - 1
      )}%' or mb_id='${uid}') ${pageQuery}`;

    // console.log("@@@@@@@@", query);
    const [result, _] = await pool.query(query);

    return result.map(convertBugoFormat);
  } catch (e) {
    console.log("#ERROR in db.getBugoByInfo\n", e);
    return [];
  }
};
const checkDI = async (di) => {
  try {
    const query = `
      select count(mb_no) as cnt from g5_member where mb_dupinfo='${di}' and mb_leave_date=''
    `;
    const [result, _] = await pool.query(query);
    return !!!result[0].cnt;
  } catch (e) {
    console.log("#ERROR in db.getBugoByInfo\n", e);
    return false;
  }
};

const getAppliedBugoAndAccount = async (uid) => {
  try {
    // const query = `
    // select t1.*, t2.wr_2 as funeralName, t2.wr_4 as binso, t2.wr_9 as deceasedName from
    //   (select a.od_id as id, a.account_bank as accountBank, a.account_name as accountName, a.account_number as accountNum, o.wr_id as bugoId
    //   from custom_price as a inner join g5_shop_order as o on a.od_id = o.od_id where a.name='${name}' and a.hp='${phone}' and o.od_status='완료') as t1 inner join g5_write_bugo as t2 on t1.bugoId = t2.wr_id
    // `;
    const query = `
    select o2.*, b.wr_2 as funeralName, b.wr_4 as binso, b.wr_9 as deceasedName from 
    (select p.*, o.wr_id as bugoId from
    (select od_id as odid, account_bank as accountBank, account_name as accountName, account_number as accountNum, name as sangjuName 
    from custom_price where mb_id='${uid}' or mb_id2='${uid}') as p inner join g5_shop_order as o on p.odid=o.od_id where o.od_status !='주문')
    as o2 inner join g5_write_bugo as b on o2.bugoId=b.wr_id
    `;

    const [result, _] = await pool.query(query);

    console.log("[query]\n", query);
    console.log("\n[result]\n", result);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getAppliedBugoAndAccount\n", e);
    return [];
  }
};

const addMsg = async (sender, msg, bugoId) => {
  try {
    const query1 = `select count(wr_parent) as cnt from g5_write_bugo where wr_parent=${bugoId} and wr_delete=0`;
    const [result, _] = await pool.query(query1);
    const addNum = result[0].cnt;
    console.log("#1: ", addNum, result);

    const queryInsert = `
  insert into g5_write_bugo(
    wr_parent, wr_name, wr_content, wr_is_comment, wr_comment, wr_datetime,
    wr_reply, wr_comment_reply, ca_name, wr_option, wr_subject, 
    wr_link1, wr_link2, mb_id, wr_password, wr_email, 
    wr_homepage, wr_last, wr_ip, wr_facebook_user, wr_twitter_user, 
    wr_1, wr_2, wr_3, wr_4, wr_5, 
    wr_6, wr_7, wr_8, wr_9, wr_10, wr_11,
    wr_12, wr_13, wr_14, wr_15, wr_16, wr_17, wr_18, wr_19, wr_20,
    wr_delete) 
    values(
      ${bugoId}, '${sender}', '${msg}', 1, ${addNum}, '${getDateStr()}',
      '', '', '', '', '', 
      '', '', 0, '', '', 
      '', '', '', '', '', 
      '', '', '', '', '', 
      '' , '', '', '', '', '',
      '', '', '', '', '', '', '', '', '',
      0)
  `;
    const [resultInsert, __] = await pool.query(queryInsert);
    console.log("#2: ", resultInsert);
    return !!resultInsert?.affectedRows || false;
  } catch (e) {
    console.log("#ERROR in db.addMsg\n", e);
    return false;
  }
};

const addCounsel = async (email, content, uid, uname) => {
  try {
    const strNow = getDateStr();

    const query = `insert into g5_qa_content(
      qa_type, qa_email, qa_subject, qa_content, qa_datetime, mb_id,
      qa_num, qa_name, qa_3, qa_email_recv)
      values(0, '${email}', '${
      strNow.split(" ")[0]
    }_문의', '${content}', '${getDateStr()}', '${uid}',
      -1, '${uname}', 'mobile', 1)`;
    const [result, _] = await pool.query(query);
    pool.query(
      `update g5_qa_content set qa_parent=${result.insertId}, qa_related=${result.insertId} where qa_id=${result.insertId}`
    );
    return !!result?.affectedRows || false;
  } catch (e) {
    console.log("#ERROR in db.addCounsel\n", e);
    return false;
  }
};
const getTotalSangju = async () => {
  const [result, _] = await pool.query(`select cf_5 from g5_config`);
  return result[0].cf_5;
};

const loginMaster = async (no, deviceKind, deviceKey, token) => {
  try {
    const query = `update g5_member set mb_10='${deviceKey}', mb_7='${deviceKind}', mb_8='${token}' where mb_no=${no}`;
    console.log(query);
    const [result, _] = await pool.query(query);
    return true;
  } catch (e) {
    console.log("#ERROR in db.loginMaster\n", e);
    return false;
  }
};
const findUser = async (uid, pw) => {
  // const query  = `select mb_no as no from g5_member where `
  // const result = await pool.query(query);
  try {
    const encryptPw = sha1(pw + "bugo.iozen");
    const query = `select mb_no as no from g5_member where mb_id='${uid}' and mb_password='${encryptPw}' and mb_leave_date=''`;

    const [result, _] = await pool.query(query);

    return result.length ? result[0].no : 0;
  } catch (e) {
    console.log("#ERROR in db.findUser\n", e);
    return 0;
  }
};

const getMaster = async (token) => {
  try {
    const query = `select mb_name as name, mb_hp as phone, mb_id as uid, mb_email as email, mb_dupinfo as primaryValue, mb_3 as code, mb_1 as company, mb_2 as position from g5_member where mb_8='${token}' and mb_leave_date=''`;

    const [result, _] = await pool.query(query);

    return result.length ? result[0] : null;
  } catch (e) {
    console.log("#ERROR in db.getMaster\n", e);
    return null;
  }
};
const findUserByPV = async (pv, type) => {
  try {
    const query = `select mb_id as id from g5_member where mb_dupinfo='${pv}' and mb_level=${type}`;
    const [result, _] = await pool.query(query);
    return result[0]?.id || "";
  } catch (e) {
    console.log("#ERROR in db.findUserByPV\n", e);
    return "";
  }
};

const addUser = async (input, type) => {
  // type: 2 | 3
  const now = getDateStr();
  const normalId = `${input.phone}_${new Date()
    .getTime()
    .toString()
    .substring(8)}`;
  try {
    let query;
    const pw = sha1(input.pw + "bugo.iozen");
    if (type === 3)
      query = `
    insert into g5_member(
      mb_no, mb_id, mb_password, mb_name, mb_nick, 
      mb_nick_date, mb_email, mb_homepage, mb_level, mb_sex, 
      mb_birth, mb_tel, mb_hp, mb_certify, mb_adult, 
      mb_dupinfo, mb_zip1, mb_zip2, mb_addr1, mb_addr2, 
      mb_addr3, mb_addr_jibeon, mb_signature, mb_recommend, mb_point, 
      mb_login_ip, mb_ip, mb_leave_date, mb_intercept_date, mb_email_certify2, 
      mb_memo, mb_lost_certify, mb_mailling, mb_sms, mb_open, 
      mb_open_date, mb_profile, mb_memo_call, mb_memo_cnt, mb_scrap_cnt, 
      mb_1, mb_2, mb_3, mb_4, mb_5, 
      mb_6, mb_7, mb_8, mb_9, mb_10,
      mb_datetime) 
      values(
        null, '${input.uid}', '${pw}', '${input.name}', '${input.name}', 
        '0000-00-00', '${input.email}', '', 3, '', 
        '', '', '${input.phone}', '', 0, 
        '${input.primaryValue}', '', '', '', '', 
        '', '', '', '', 0, 
        '', '', '', '', '', 
        '', '', 0, 0, 0, 
        '0000-00-00', '', '', 0, 0, 
        '${input.company}', '${input.position}', '${input.code}', '', '', 
        '', '${input.deviceKind}', '', '${input.privateNum}', '${input.deviceKey}',
        '${now}')`;
    else
      query = `
        insert into g5_member(
          mb_no, mb_id, mb_password, mb_name, mb_nick, 
          mb_nick_date, mb_email, mb_homepage, mb_level, mb_sex, 
          mb_birth, mb_tel, mb_hp, mb_certify, mb_adult, 
          mb_dupinfo, mb_zip1, mb_zip2, mb_addr1, mb_addr2, 
          mb_addr3, mb_addr_jibeon, mb_signature, mb_recommend, mb_point, 
          mb_login_ip, mb_ip, mb_leave_date, mb_intercept_date, mb_email_certify2, 
          mb_memo, mb_lost_certify, mb_mailling, mb_sms, mb_open, 
          mb_open_date, mb_profile, mb_memo_call, mb_memo_cnt, mb_scrap_cnt, 
          mb_1, mb_2, mb_3, mb_4, mb_5, 
          mb_6, mb_7, mb_8, mb_9, mb_10,
          mb_datetime) 
          values(
            null, '${normalId}', '', '${input.name}', '${input.name}', 
            '0000-00-00', '', '', 2, '', 
            '', '', '${input.phone}', '', 0, 
            '${input.primaryValue}', '', '', '', '', 
            '', '', '', '', 0, 
            '', '', '', '', '', 
            '', '', 0, 0, 0, 
            '0000-00-00', '', '', 0, 0, 
            '', '', '', '', '', 
            '', '${input.deviceKind}', '${input.token}', '${input.privateNum}', '${input.deviceKey}',
            '${now}')`;

    const result = await pool.query(query);
    if (result[0]) {
      return type === 2
        ? { no: result[0].insertId, id: normalId }
        : { no: result[0].insertId, id: input.uid };
    } else return {};
  } catch (e) {
    console.log("#ERROR in db.addUser\n", e);
    return {};
  }
};

const updateMaster = async (input) => {
  try {
    let query = "";
    if (input.pw.length) {
      const encryptPw = sha1(input.pw + "bugo.iozen");
      query = `
      update g5_member set
      mb_email='${input.email}',
      mb_name='${input.name}',
      mb_nick='${input.name}', 
      mb_1='${input.company}',
      mb_2='${input.position}',
      mb_3='${input.code}',
      mb_password='${encryptPw}' 
      where mb_id='${input.uid}'
    `;
    } else
      query = `update g5_member set
    mb_email='${input.email}',
    mb_name='${input.name}',
    mb_nick='${input.name}', 
    mb_1='${input.company}',
    mb_2='${input.position}',
    mb_3='${input.code}' 
    where mb_id='${input.uid}'`;

    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.updateMaster\n", e);
    return {};
  }
};

const updateForNewUser = async (no, id, name, phone) => {
  try {
    const query = `
      select od_id from g5_shop_order where od_b_name='${name}' and od_b_hp='${phone}'
    `;
    const [result1, _] = await pool.query(query);
    const receivedOdid = result1.map((r) => r.od_id);

    // 자신이 받은 화환의 정산 내역의 mb_id 갱신
    const queryAccount = `update custom_account set mb_id='${id}' where sangju_name='${name}' and sangju_hp='${phone}' and type=1`;
    await pool.query(queryAccount);

    // 자신이 보낸 화환 내역의 send_mb_no 갱신
    const querySend = `update custom_wreath set send_mb_no=${no} where od_name='${name}' and od_hp='${phone}'`;
    await pool.query(querySend);

    // 자신이 받은 화환 내역의 recv_mb_no 갱신
    if (receivedOdid.length) {
      let strOdids = "(";
      for (const odid of receivedOdid) {
        strOdids += `'${odid}', `;
      }
      strOdids = strOdids.substring(0, strOdids.length - 2) + ")";

      const queryReceived = `update custom_wreath set recv_mb_no=${no} where od_id in ${strOdids}`;
      await pool.query(queryReceived);
    }

    // 자신에게 신청된 부의금 서비스 내역의 mb_id 갱신
    const queryPrice = `update custom_price set mb_id='${id}' where name='${name}' and hp='${phone}'`;
    await pool.query(queryPrice);
    return true;
  } catch (e) {
    console.log("#ERROR in db.updateForNewUser\n", e);
    return false;
  }
};

const updateUserNormal = async ({
  deviceKey,
  deviceKind,
  token,
  phone,
  name,
  primaryValue,
  uid,
}) => {
  try {
    const query = `update g5_member set mb_leave_date='', mb_10='${deviceKey}', mb_7='${deviceKind}', mb_8='${token}', mb_hp='${phone}', mb_name='${name}' where mb_id='${uid}'`;
    const result = await pool.query(query);

    return result[0]?.affectedRows === 1 ? true : false;
  } catch (e) {
    console.log("#ERROR in db.updateUserNormal\n", e);
    return false;
  }
};

const checkId = async (uid) => {
  try {
    const query = `select count(mb_id) as cnt from g5_member where mb_id='${uid}'`;
    const [result, _] = await pool.query(query);
    console.log(result);
    return !!result[0].cnt;
  } catch (e) {
    console.log("#ERROR in db.checkId\n", e);
    return false;
  }
};

const getMsgs = async (bugoId) => {
  try {
    const query = `select wr_name as sender, wr_content as msg from g5_write_bugo where wr_parent=${bugoId} and wr_is_comment != 0 order by wr_comment desc`;
    const [result, _] = await pool.query(query);

    return result.map((m) => {
      m.bugoId = bugoId;
      return m;
    });
  } catch (e) {
    console.log("#ERROR in db.getMsgs\n", e);
    return [];
  }
};

const getFlowerByCategory = async (category, page) => {
  const limit = 10;
  try {
    const query = `select 
    it_id as id,
    ca_id as category,
    it_name as name,
    it_price as price,
    it_cust_price as originalPrice,
    it_1 as discountRate,
    it_sc_price as deliveryFee,
    it_img1 as imgUrl 
    from g5_shop_item where ca_id='${category}' limit ${limit} offset ${
      (page - 1) * limit
    }`;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getMsgs\n", e);
    return [];
  }
};

const getFlowerById = async (fid) => {
  try {
    const query = `
      select 
        it_id as id,
        ca_id as category,
        it_name as name,
        it_price as price,
        it_cust_price as originalPrice,
        it_1 as discountRate,
        it_sc_price as deliveryFee,
        it_img1 as imgUrl 
      from g5_shop_item where it_id=${fid}
    `;
    const [result, _] = await pool.query(query);
    console.log(result);
    return result[0] || null;
  } catch (e) {
    console.log("#ERROR in db.getFlowerById\n", e);
    return null;
  }
};

const getFlowerSenderOfBugo = async (bugoId) => {
  try {
    const query = `select content1 as sender from custom_wreath where wr_id=${bugoId}`;
    const [result, _] = await pool.query(query);
    console.log(result);
    return result.map((r) => r.sender);
  } catch (e) {
    console.log("#ERROR in db.getFlowerSenderOfBugo\n", e);
    return [];
  }
};

const getMyCalcPrice = async (uid) => {
  try {
    const query = `select sum(account_price) as price from custom_account where mb_id='${uid}'`;
    const [result, _] = await pool.query(query);
    return result[0].price || 0;
  } catch (e) {
    console.log("#ERROR in db.getMyCalcPrice\n", e);
    return 0;
  }
};

const addBugo = async (bugo, writer) => {
  //
  try {
    const { funeral, deceased, sangjus, imprintTime, buried } = bugo;

    const convertedGeo = await convertGeo(funeral.x, funeral.y);
    const cntSangju = JSON.parse(sangjus).length;
    const query = `insert into g5_write_bugo(
      wr_is_comment, wr_comment, mb_id, wr_name, wr_datetime, 
      wr_1, wr_2, wr_3, wr_4, wr_5, 
      wr_6, wr_7, wr_9, wr_10, wr_11,
      wr_subject, wr_content, wr_reply, wr_comment_reply, ca_name, 
      wr_option, wr_link1, wr_link2, wr_password, wr_email, 
      wr_homepage, wr_last, wr_ip, wr_facebook_user, wr_twitter_user, wr_12,
      wr_13, wr_14, wr_15, wr_16, wr_17, wr_18, wr_19, wr_20, wr_delete, wr_8) 
      values(
        0, 0, '${writer}', '${deceased.name}', '${getDateStr()}',
        '${sangjus}', '${funeral.name}', '${funeral.address}', '${
      funeral.binso
    }', '${deceased.time}',
        '${imprintTime}', '${buried}', '${deceased.name}', '${
      deceased.age
    }', '${deceased.gender}',
        '', '', '', '', '', 
        '', '', '', '', '', 
        '', '0000-00-00 00:00:00', '', '', '', '${convertedGeo}',
        '', '', '', '', '', '', '', '', 0, '')`;
    const [result, _] = await pool.query(query);
    // console.log(result);
    if (!result.insertId) return 0;

    const [result2, __] = await pool.query(
      `update g5_write_bugo set wr_parent=${result.insertId} where wr_id=${result.insertId}`
    );

    pool.query(`update g5_config set cf_5 = cf_5 + ${cntSangju}`).then(() => {
      console.log("cnt updated!");
    });

    addMsg(
      "Smart 부고 임직원 일동",
      "삼가 고인의 명복을 빕니다.",
      result.insertId
    );

    return result2.affectedRows === 1 ? result.insertId : 0;
  } catch (e) {
    console.log("#ERROR in db.addBugo\n", e);
    return 0;
  }
};
const updateBugo = async (bugo, bugoId) => {
  try {
    const { funeral, deceased, writer, sangjus, imprintTime, buried } = bugo;
    const prevBugo = await getBugoById(bugoId);

    const newSangjus = JSON.parse(sangjus);
    const prevSangjus = JSON.parse(prevBugo.sangjus);
    const cntPrev = prevSangjus.length;

    let cntEqual = 0;
    for (const s of newSangjus) {
      if (
        prevSangjus.findIndex(
          (p) => p.wr_1_name === s.wr_1_name && p.wr_1_tel && s.wr_1_tel
        ) !== -1
      )
        cntEqual++;
    }

    const restNew = newSangjus.length - cntEqual;
    const restPrev = cntPrev - cntEqual;
    const diff = restNew - restPrev;
    if (diff) {
      pool.query(`update g5_config set cf_5 = cf_5 + (${diff})`);
    }
    const query = `update g5_write_bugo set 
      wr_1='${sangjus}',
      wr_2='${funeral.name}',
      wr_3='${funeral.address}}',
      wr_4='${funeral.binso}',
      wr_5='${deceased.time}',
      wr_6='${imprintTime}',
      wr_7='${buried}',
      wr_9='${deceased.name}',
      wr_10=${deceased.age},
      wr_11='${deceased.gender}'
    where wr_id=${bugoId}`;
    const [result, _] = await pool.query(query);

    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.updateBugo\n", e);
    return false;
  }
};

const deleteBugo = async (bugoId) => {
  try {
    const query = `update g5_write_bugo set wr_delete=1 where wr_id=${bugoId}`;
    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.deleteBugo\n", e);
    return false;
  }
};

const appliableSangju = async (bugoId, sangju) => {
  try {
    const query = `select od_id from custom_price where wr_id=${bugoId} and name='${sangju.name}' and hp='${sangju.phone}'`;
    const [result, __] = await pool.query(query);
    return !!!result.length;
  } catch (e) {
    console.log("#ERROR in db.appliableSangju\n", e);
    return false;
  }
};
const addAppliedLog = async ({ input, odid, appliedInfo, masterId }) => {
  try {
    const { depositInfo } = input.billing;
    let query = ``;
    console.log(depositInfo && depositInfo.checkedBill);
    if (depositInfo && depositInfo.checkedBill)
      query = `insert into custom_price(
        od_id, mb_id, wr_id,
        name, relation, hp, account_bank, account_name,
        account_number, cash_receipt, cash_hp, cash_pn, cash_bn, mb_id2
    ) values (
      '${odid}', '${appliedInfo?.uid || ""}', ${input.bugoId},
      '${input.sangju.name}', '${input.sangju?.relation || ""}', '${
        input.sangju.phone
      }', '${input.account.bank}', '${input.account.name}',
      '${input.account.num}', '${depositInfo.billType}', '${
        depositInfo.billType.startsWith("개인소득공제용")
          ? depositInfo.billValue
          : ""
      }', '', '${
        depositInfo.billType.startsWith("사업자지출증빙용")
          ? depositInfo.billValue
          : ""
      }', '${masterId || ""}'
    )`;
    else
      query = `
    insert into custom_price(
        od_id, mb_id, wr_id,
        name, relation, hp, account_bank, account_name,
        account_number, cash_receipt, cash_hp, cash_pn, cash_bn
    ) values (
      '${odid}', '${appliedInfo?.uid || ""}', ${input.bugoId},
      '${input.sangju.name}', '${input.sangju?.relation || ""}', '${
        input.sangju.phone
      }', '${input.account.bank}', '${input.account.name}',
      '${input.account.num}', '', '', '', '')
    `;

    console.log(query);
    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addAppliedLog\n", e);
    return 0;
  }
};

const addCalcLog_money = async (log) => {
  try {
    const { odid, uid, level, name, sname, sphone, price, calcPrice } = log;
    const ac_id = acid();
    let query = ``;
    if (level === 2) {
      query = ``;
    } else {
      query = `
        insert into custom_account(
          idx, mb_id, mb_level, mb_name, sangju_name, sangju_hp,
          type, status, result, price, 
          ac_id, account_price, memo,
          ap_datetime, ac_datetime, datetime
        ) values (
          '${odid}', '${uid}', 3, '${name}', '', '',
          2, '완료', '대기', ${price}, 
          '${ac_id}', ${calcPrice}, '',
          '0000-00-00 00:00:00', '0000-00-00 00:00:00', '${getDateStr()}'
        )
      `;
    }
    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addCalcLog_money\n", e);
    return false;
  }
};

const addCalcLog_flower = async (odid, target, status, flower) => {
  try {
    // const { odid, uid, level, name, sname, sphone, price } = log;

    const { level, name, phone, uid, code } = target;
    console.log("@@@@ calc target @@@@ \n", target);
    const ac_id = acid();
    let calcPrice = 0;
    if (level === 2) {
      const rate = await getNormalCalcRate();
      console.log("@rate : ", Number(rate), typeof rate);
      calcPrice = flower.price * (Number(rate) / 100);
    } else {
      const fCode = code.split(":")[0];

      calcPrice = (flower.price * (Number(fCode.split(".")[1]) || 0)) / 100;
    }

    const query = `
        insert into custom_account(
          idx, mb_id, mb_level, mb_name, sangju_name, sangju_hp,
          type, status, result, price, 
          ac_id, account_price, memo,
          ap_datetime, ac_datetime, datetime
        ) values (
          '${odid}', '${uid || ""}', ${level}, '${name}', '${
      level === 2 ? name : ""
    }', '${level === 2 ? phone : ""}',
          1, '${status}', '대기', ${flower.price + flower.deliveryFee}, 
          '${ac_id}', ${calcPrice}, '',
          '0000-00-00 00:00:00', '0000-00-00 00:00:00', '${getDateStr()}'
        )
      `;

    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addCalcLog_flower\n", e);
    return false;
  }
};

const addOrder = async (odid, input, orderer, price) => {
  try {
    const strNow = getDateStr();
    // let depositName = "";
    // if (input.billing.method) {
    //   const date = new Date();
    //   depositName =
    //     orderer.name +
    //     date.getHours().toString() +
    //     date.getMinutes().toString();
    // }

    let query = "";
    if (input.billing.method === "무통장") {
      query = `
      insert into g5_shop_order(
        od_id, mb_id, mb_name, od_deposit_name, 
        od_bank_account, od_settle_case, wr_id,
        od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info, od_type,
        od_status, od_hp,
        od_email_recv, 
        od_kakao_recv, 
        od_email,
        od_time, od_cart_price, od_misu,
        mb_level
      ) values(
        '${odid}', '${orderer?.uid ?? ""}', '${orderer.mb_name}', '${
        input.sangju.name
      }', 
        '', '무통장', ${input.bugoId}, 
        '', '', '', 0, '', '', 2,
        '주문', '${orderer.mb_hp}',
        ${input.billing.depositInfo.checkedEmail ? 1 : 0},
        1,
        '${
          input.billing.depositInfo.checkedEmail
            ? input.billing.depositInfo.email
            : ""
        }',
        '${strNow}', ${price}, ${price}, ${
        orderer.mb_id.length ? orderer.level : 1
      }
      )
    `;
    } else
      query = `
    insert into g5_shop_order(
      od_id, mb_id, mb_name, od_deposit_name, 
      od_bank_account, od_settle_case, wr_id,
      od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info, od_type,
      od_status, od_email_recv, od_kakao_recv, od_email, od_hp,
      od_time, od_cart_price, od_receipt_price, mb_level
    ) values(
      '${odid}', '${orderer.uid}', '${orderer.mb_name}', '${
        input.sangju.name
      }', 
      '${input.billing.mid}', '${input.billing.method}',
      ${input.bugoId}, 
      '', '', '', 0, '', '', 2,
      '입금', 0, 0, '', '${orderer.mb_hp}',
      '${strNow}', ${price}, ${price}, ${
        orderer.mb_id.length ? orderer.level : 1
      }
    )
  `;

    const query2 = `
      insert into g5_shop_cart(
        od_id, mb_id, it_id,
        it_name, ct_price, ct_select_time, ct_time, ct_history, ct_qty,
        ct_status
      ) values(
        '${odid}', '${orderer.mb_id}', '1618368895', 
        '부의금 서비스', ${price}, '${strNow}', '${strNow}', '', 1, '${
      input.billing.method === "무통장" ? "주문" : "입금"
    }'
      )
  `;

    // console.log(query);
    const [result, _] = await pool.query(query);
    pool.query(query2);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addOrder\n", e);
    return false;
  }
};
const payment = async (mid, paramType) => {
  try {
    if (paramType !== "odid") {
      const query = `update g5_shop_order set od_status='입금' where od_bank_account='${mid}'`;
      const [result, _] = await pool.query(query);
    }
    const where =
      paramType === "mid"
        ? ` where od_bank_account='${mid}' `
        : ` where od_id='${mid}' `;
    const query2 = `
    select o2.*, i.it_name as flowerName, i.it_price as price, i.it_sc_qty as deliveryFee from 
    (select o.*, w.it_id as fid, w.content1 as p1, w.content2 as p2 from
      (select od_id as odid, od_hp as ordererPhone, od_settle_case as method, od_b_name as sangju, od_b_addr1 as destAddress, od_b_addr2 as destDetail from g5_shop_order ${where}) as o inner join custom_wreath as w on o.odid=w.od_id) as o2 inner join g5_shop_item as i on o2.fid=i.it_id
    `;
    console.log("### ", query2);
    const [result2, __] = await pool.query(query2);
    return result2[0];
  } catch (e) {
    console.log("#ERROR in db.payment\n", e);
    return null;
  }
};
const addOrderFlower = async (
  odid,
  sender,
  orderPerson,
  destination,
  flower,
  billing,
  bugoId,
  sangju,
  cardReady = false
) => {
  console.log(`@@@@@ `, JSON.stringify(sender), JSON.stringify(orderPerson));
  // sender: 결제한 사람
  // orderPerson: 보내는 사람
  try {
    const strNow = getDateStr();
    const query = `
    insert into g5_shop_order (
      od_id, mb_id, mb_name,
      od_name, od_tel, od_hp,
      od_addr1, od_addr2,
      od_b_name, od_b_tel, od_b_hp,
      od_b_addr1, od_b_addr2,
      od_cart_count, od_cart_price, od_receipt_price, od_bank_account, 
      od_status, od_settle_case,
      wr_id, od_type, od_deposit_name, od_time, od_send_cost,
      od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info,
      od_email_recv, od_kakao_recv, od_email, od_misu, mb_level
    ) values(
      '${odid}', '${sender?.uid ?? ""}', '${sender?.name ?? ""}',
      '${orderPerson.name}', '${orderPerson.phone}', '${orderPerson.phone}',
      '${destination.address}', '${destination.detail}',
      '${sangju.name}', '${sangju.phone}', '${sangju.phone}',
      '${destination.address}', '${destination.detail}',
      1, ${flower.price + flower.deliveryFee}, ${
      billing.method === "무통장" ? 0 : flower.price + flower.deliveryFee
    }, '${billing.method === "무통장" ? "" : billing.mid}', 
      '${cardReady || billing.method === "무통장" ? "주문" : "입금"}', '${
      billing.method
    }', 
      ${bugoId}, 1, '${orderPerson.name}', '${strNow}', ${flower.deliveryFee},
      '', '', '', 0, '', '',
      ${billing.depositInfo?.checkedEmail ? 1 : 0},
      ${billing.depositInfo ? 1 : 0},
      '${billing.depositInfo?.checkedEmail ? billing.depositInfo.email : ""}',
      ${billing.method === "무통장" ? flower.price + flower.deliveryFee : 0}, ${
      sender && sender.uid ? sender.level ?? 1 : 1
    }
    )
    `;

    const query2 = `
      insert into g5_shop_cart(
        od_id, mb_id, it_id,
        it_name, ct_price, ct_select_time, ct_time, ct_history, ct_qty,
        ct_status
      ) values(
        '${odid}', '${sender?.uid ?? ""}', '${flower.id}', 
        '${flower.name}', ${flower.price}, '${strNow}', '${strNow}', '', 1,
        '${billing.method === "무통장" ? "주문" : "입금"}'
      )
  `;

    // console.log("QUERY :::  ", query);
    const [result, _] = await pool.query(query);
    pool.query(query2);

    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addOrderFlower\n", e);
    return false;
  }
};

const getServicePrice = async () => {
  try {
    const query = `
      select cf_1 as price from g5_config
    `;
    const [result, _] = await pool.query(query);
    return result[0]?.price ?? 0;
  } catch (e) {
    console.log("#ERROR in db.getServicePrice\n", e);
    return false;
  }
};

const getBugoCalcOfMaster = async (uid, bugoId) => {
  try {
    const query = `
      select account_price as calcPrice from custom_account where idx=${bugoId} and mb_id='${uid}'
    `;
    const [result, _] = await pool.query(query);
    return result[0]?.calcPrice ?? 0;
  } catch (e) {
    console.log("#ERROR in db.getBugoCalcOfMaster\n", e);
    return false;
  }
};

const getAccountLogByMbId = async (uid) => {
  try {
    const query = `
    select aa.*, b.wr_9 as deceasedName, b.wr_1 as sangjus from
      (select a.*, p.wr_id as bugoId, p.account_bank as accountBank, p.account_name as accountName, p.account_number as accountNum from 
      (select idx as odid, account_price as calcPrice from custom_account where mb_id='${uid}') as a inner join custom_price as p on a.odid=p.od_id) as aa inner join g5_write_bugo as b on aa.bugoId=b.wr_id
    `;

    const [result, _] = await pool.query(query);

    return result;
  } catch (e) {
    console.log("#ERROR in db.getAccountLogByMbId\n", e);
    return false;
  }
};

const getFlowerLogOfMaster = async (uid) => {
  try {
    const query = `
    select o4.*, b.wr_1 as sangjus, b.wr_9 as deceasedName from
      (select o3.*, a.account_price as calcPrice from 
      (select o2.*, i.it_price as flowerPrice, i.it_img1 as imgUrl, i.it_name as flowerName from 
      (select o.*, w.it_id as flowerId from
        (select od_id as odid, od_time as orderTime, wr_id as bugoId from g5_shop_order where mb_id='${uid}' and od_type=1) 
        as o 
        inner join custom_wreath as w on o.odid = w.od_id
      ) as o2 inner join g5_shop_item as i on o2.flowerId=i.it_id) as o3 inner join custom_account as a on o3.odid=a.idx where a.mb_id='${uid}') as o4 inner join g5_write_bugo as b on o4.bugoId=b.wr_id
    `;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getOdidFlowerByUid\n", e);
    return false;
  }
};

const getFlowerLogOfCommon = async (no) => {
  try {
    const query = `
  select o3.*, a.account_price as calcPrice from 
  (select o2.*, i.it_name as flowerName, i.it_price as flowerPrice, i.it_img1 as imgUrl from
    (select w.*, o.od_time as orderTime, o.od_b_name as sangju from 
      (select od_id as odid, wr_id as bugoId, it_id as flowerId, bugo_name as deceasedName, send_mb_no as senderNo, recv_mb_no as receiverNo from custom_wreath where send_mb_no=${no} or recv_mb_no=${no})
      as w inner join g5_shop_order as o on w.odid=o.od_id)
    as o2 inner join g5_shop_item as i on o2.flowerId=i.it_id)
  as o3 left join custom_account as a on o3.odid=a.idx
  `;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getFlowerLogOfCommon\n", e);
    return false;
  }
};

const getOrderData = async (odid) => {
  try {
    const query = `
      select
        od_name as senderName,
        od_hp as senderPhone,
        od_b_name as receiverName,
        od_b_hp as receiverPhone,
        od_b_addr1 as dAddr,
        od_b_addr2 as dDetail,
        od_settle_case as billingMethod,
        od_send_cost as deliveryFee,
        od_shop_memo as memo
      from g5_shop_order
      where od_id='${odid}'
    `;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getOrderData\n", e);
    return false;
  }
};

const addFlowerLog = async (
  odid,
  orderPerson,
  phrases,
  flower,
  destination,
  billing,
  sangju,
  bugoId,
  deceasedName
) => {
  try {
    // 받는 사람이 존재하는 회원인지 판별
    const reciever = await getUserByInfo(sangju);
    // 보내는사람이 존재하는 회원인지 판별
    const sender = await getUserByInfo(orderPerson);

    // insert
    const query = `
      insert into custom_wreath(
        od_id, od_name, od_hp,
        content1, content2, it_id,
        recv_mb_no, send_mb_no,
        bugo_name, payment, price,
        wr_id, delivery, delivery_memo
      ) values(
        '${odid}', '${orderPerson.name}', '${orderPerson.phone}',
        '${phrases[0]}', '${phrases[1]}', '${flower.id}',
        ${reciever ? reciever.no : -1}, ${sender ? sender.no : -1},
        '${deceasedName || ""}', '${billing.method}', '${flower.price}',
        ${bugoId || 0}, '${destination.address} ${destination.detail}', '${
      destination.memo
    }'
      )
    `;
    console.log(query);
    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.addFlowerLog\n", e);
    return false;
  }
};
// const addSangjus = async (sangjus, bugoId) => {
//   let success = 0;
//   for (let sangju of sangjus) {
//     success += await addSangju(sangju, bugoId);
//   }
//   // 등록에 실패한 상주 수를 resolve
//   return sangjus.length - success;
// };

// const getBugoIdsBySangju = async (name, phone) => {
//   // try {
//   //   const con = await mysql.createConnection(config);
//   //   const query = `select uuid from sangju where name='${name}' and phone='${phone}'`;
//   //   console.log("#Execute#\n", query);
//   //   const [rows, fields] = await con.execute(query);
//   //   return rows.map((r) => r.uuid);
//   // } catch (e) {
//   //   console.log("#ERROR in db.getBugoIdsBySangju\n", e);
//   //   return [];
//   // }
// };

// const getSangjuListByBugoId = async (uuid) => {
//   // try {
//   //   const con = await mysql.createConnection(config);
//   //   const query = `select * from sangju where uuid='${uuid}'`;
//   //   console.log("#Execute#\n", query);
//   //   const [rows, fields] = await con.execute(query);
//   //   return rows;
//   // } catch (e) {
//   //   console.log("#ERROR in db.getSangjuListByBugoId\n", e);
//   //   return [];
//   // }
// };

const getFAQ = async () => {
  try {
    const query = `select c.fm_subject as category, f.fa_subject as question, f.fa_content as answer from g5_faq as f left join g5_faq_master as c on f.fm_id=c.fm_id`;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.log("#ERROR in db.getFAQ\n", e);
    return [];
  }
};

const getUserNoByToken = async (token) => {
  try {
    const query = `select mb_no as no from g5_member where mb_8='${token}'`;
    const [result, _] = await pool.query(query);
    if (!result[0]) return 0;
    return result[0].no || 0;
  } catch (e) {
    console.log("#ERROR in db.getUserNoByToken\n", e);
    return 0;
  }
};

const applyCalcAccount = async (token, name, bank, num) => {
  try {
    // const no = await getUserNoByToken(token);
    // if (no === 0) return false;
    const queryUpdate = `
      update g5_member set
        mb_4='${name}',
        mb_5='${bank}',
        mb_6='${num}'
      where mb_8='${token}'
    `;
    const [resultUpdate, __] = await pool.query(queryUpdate);
    console.log(queryUpdate, resultUpdate);
    return !!resultUpdate.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.applyCalcAccount\n", e);
    return false;
  }
};

const updateServiceAccount = async (odid, name, bank, num) => {
  try {
    const query = `
      update custom_price set
        account_name='${name}',
        account_bank='${bank}',
        account_number='${num}'
      where od_id='${odid}'
    `;
    const [result, _] = await pool.query(query);
    return !!result.affectedRows;
  } catch (e) {
    console.log("#ERROR in db.updateServiceAccount\n", e);
    return false;
  }
};

const confirmCode = async (code) => {
  try {
    const query = `select count(mb_3) as cnt from g5_member where mb_3='${code}' and mb_level=4`;
    const [result, _] = await pool.query(query);
    return result[0].cnt || 0;
  } catch (e) {
    console.error("#ERROR in db.confirmCode\n", e);
    return 0;
  }
};

const getLogFlowerByBugoId = async (bugoId) => {
  try {
    const query = `
      select 
        od_id as orderNo,
        bugo_name as deceasedName,
        send_mb_no as senderNo,
        od_name as orderName,
        od_hp as orderPhone,
        it_id as flowerId,
        payment as paymentMethod,
        price as billingPrice,
        wr_id as bugoId,
        delivery as address,
        delivery_memo as memo,
        sangju_price as calcMoneyForSangju,
        account_price as calcMoneyForMaster
      from custom_wreath
      where wr_id=${bugoId}
    `;
    const [result, _] = await pool.query(query);
    return result;
  } catch (e) {
    console.error("#ERROR in db.getLogFlowerByBugoId\n", e);
    return [];
  }
};
const getLogFlowerInBugoIds = async (strBugoIds) => {
  try {
    const query = `
      select 
        od_id as orderNo,
        bugo_name as deceasedName,
        send_mb_no as senderNo,
        od_name as orderName,
        od_hp as orderPhone,
        it_id as flowerId,
        payment as paymentMethod,
        price as billingPrice,
        wr_id as bugoId,
        delivery as address,
        delivery_memo as memo,
        sangju_price as calcMoneyForSangju,
        account_price as calcMoneyForMaster
      from custom_wreath
      where wr_id in ${strBugoIds}
    `;
    console.log(query);
    const [result, _] = await pool.query(query);
    console.log(result);

    return result;
  } catch (e) {
    console.error("#ERROR in db.getLogFlowerByBugoId\n", e);
    return [];
  }
};

const leaveUser = async (token, memo) => {
  try {
    const query = `
      update g5_member set mb_leave_date='${getDateStr()
        .split(" ")[0]
        .split("-")
        .join("")}', mb_memo='${memo}' where mb_8='${token}' 
    `;
    const [result, _] = await pool.query(query);
    console.log(result);
    return !!result.affectedRows || false;
  } catch (e) {
    console.error("#ERROR in db.leave\n", e);
    return false;
  }
};

const getNormalCalcRate = async () => {
  try {
    const query = "select cf_4 from g5_config";
    const [result, _] = await pool.query(query);
    return result[0].cf_4;
  } catch (e) {
    console.error("#ERROR in db.getNormalCalcRate\n", e);
    return false;
  }
};

const getUserByToken = async (token) => {
  try {
    const query = `select * from g5_member where mb_8='${token}'`;
    const [result, _] = await pool.query(query);
    return result[0];
  } catch (e) {
    console.error("#ERROR in db.getUserByToken\n", e);
    return null;
  }
};

const etcContent = async (title) => {
  try {
    let contentId = "";
    switch (title) {
      case "이용약관":
        contentId = "provision";
        break;
      case "개인정보취급방침":
        contentId = "privacy";
        break;
      case "전자금융거래이용약관":
        contentId = "content1";
        break;
      case "개인정보수집및이용안내":
        contentId = "content4";
        break;
      case "개인정보제3자제공/위탁안내":
        contentId = "content2";
        break;
      case "개인정보제3자동의(배송및주문처리목적)":
        contentId = "content3";
        break;
      case "사업자정보확인":
        contentId = "content5";
        break;
      default:
        return "";
    }
    const query = `select co_content as content from g5_content where co_id='${contentId}'`;
    const [result, _] = await pool.query(query);
    return result[0].content;
  } catch (e) {
    console.error("#ERROR in db.etcContent\n", e);
    return "";
  }
};

const plusCount = async (type: "kakao" | "msg") => {
  try {
    const query =
      type === "kakao"
        ? `update g5_config set cf_3 = cf_3+1`
        : `update g5_config set cf_2 = cf_2+1`;
    const [result, _] = await pool.query(query);

    return true;
  } catch (e) {
    console.error("#ERROR in db.plusCount\n", e);
    return false;
  }
};

const getCountForMain = async () => {
  try {
    const query = `select cf_5 as sangju, cf_3 as cntKakao, cf_2 as cntMsg from g5_config`;
    const query2 = `select sum(price) as cntMoney from custom_account where status='완료' and result='정산완료'`;
    const [result, _] = await pool.query(query);
    const [result2, __] = await pool.query(query2);

    return {
      cntMoney: result2[0].cntMoney.toString(),
      cntSangju: result[0].sangju.toString(),
      cntUser: (result[0].cntKakao + result[0].cntMsg).toString(),
    };
  } catch (e) {
    console.error("#ERROR in db.getCountForMain\n", e);
    return {
      cntMoney: "0",
      cntSangju: "0",
      cntUser: "0",
    };
  }
};

module.exports = {
  // # User
  findUser,
  findUserByPV,
  addUser,
  updateUserNormal,
  confirmCode,
  authToken,
  checkId,
  loginMaster,
  getUidByToken,
  getInfoByToken,
  getUserByInfo,
  leaveUser,

  getUserNoByToken,
  getTypeByToken,
  checkDI,
  updateForNewUser,

  // # Bugo
  addBugo,
  getMsgs,
  addMsg,
  getBugoList,
  getBugoById,
  getBugoByInfo,
  getBugoByWriter,
  updateBugo,
  deleteBugo,
  getBugoIdByWriter,
  // # Flower
  getFlowerByCategory,
  getFlowerById,
  getLogFlowerByBugoId,
  getLogFlowerInBugoIds,
  getFlowerSenderOfBugo,

  // # Account
  getCalcAccountByToken,
  getMyCalcPrice,
  applyCalcAccount,
  updateServiceAccount,

  // # Log
  addAppliedLog,
  addCalcLog_money,
  addCalcLog_flower,
  addOrder,
  addOrderFlower,
  getAccountLogByMbId,

  addFlowerLog,
  getBugoCalcOfMaster,
  getFlowerLogOfMaster,
  getFlowerLogOfCommon,
  getOrderData,

  // # Etc
  getFAQ,
  addCounsel,

  getTotalSangju,

  getAppliedBugoAndAccount,
  getAppliedSangju,

  getSangjuRelationByInfo,
  // # Deprecated
  getAppliedLogByOdid,
  // getBugoIdsBySangju,
  // getSangjuListByBugoId,
  appliableSangju,
  getUserByToken,
  getServicePrice,
  getMaster,
  updateMaster,
  etcContent,
  payment,
  getCountForMain,
  plusCount,
};
