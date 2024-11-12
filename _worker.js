let myToken = 'auto';
let botToken = '';
let chatID = '';
let enableTG = 0;
let fileName = 'am-cf-sub-rss';
let subUpdateTime = 6;
let timestamp = 4102329600000;
let total = 99 * 1125899906842624;
let download = Math.floor(Math.random() * 1099511627776);
let upload = download;

//vless://866853eb-5293-4f09-bf00-e13eb237c655@visa.com:443?encryption=none&security=tls&sni=worker.amcloud.filegear-sg.me&fp=random&type=ws&host=worker.amcloud.filegear-sg.me#youtube.com%2F%40AM_CLUB
let mainData = `
vless://98caf934-d51f-47d3-89ec-09ea781839c2@visa.cn:443?encryption=none&security=tls&sni=vless.amclubss.us.kg&fp=randomized&type=ws&host=vless.amclubss.us.kg&path=%2F%3Fed%3D2560#youtube.com%2F%40AM_CLUB%20%E8%AE%A2%E9%98%85%E9%A2%91%E9%81%93%E8%8E%B7%E5%8F%96%E6%9B%B4%E5%A4%9A%E6%95%99%E7%A8%8B
vless://98caf934-d51f-47d3-89ec-09ea781839c2@icook.hk:443?encryption=none&security=tls&sni=vless.amclubss.us.kg&fp=randomized&type=ws&host=vless.amclubss.us.kg&path=%2F%3Fed%3D2560#t.me%2FAM_CLUBS%20%E5%8A%A0%E5%85%A5%E4%BA%A4%E6%B5%81%E7%BE%A4%E8%A7%A3%E9%94%81%E6%9B%B4%E5%A4%9A%E4%BC%98%E9%80%89%E8%8A%82%E7%82%B9
vless://98caf934-d51f-47d3-89ec-09ea781839c2@time.is:443?encryption=none&security=tls&sni=vless.amclubss.us.kg&fp=randomized&type=ws&host=vless.amclubss.us.kg&path=%2F%3Fed%3D2560#github.com%2Famclubs%20GitHub%E4%BB%93%E5%BA%93%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A%E9%A1%B9%E7%9B%AE
`;

let urls = [
    //'https://am.amclubs.us.kg/auto?sub'
];

let subConverter = "url.v1.mk";
let subConfig = "https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini";
let subProtocol = 'https';

export default {
    async fetch(request, env) {
        const userAgent = request.headers.get('User-Agent')?.toLowerCase() || "null";
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        myToken = env.TOKEN || myToken;
        botToken = env.TG_TOKEN || botToken;
        chatID = env.TG_ID || chatID;
        enableTG = env.TG_ENABLE || enableTG;
        subConverter = env.SUB_CONVERTER || subConverter;
        subConfig = env.SUB_CONFIG || subConfig;
        fileName = env.SUB_NAME || fileName;
        mainData = env.SUB || mainData;
        urls = env.SUB_LINK ? await addIpText(env.SUB_LINK) : urls;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const timeTemp = Math.ceil(currentDate.getTime() / 1000);
        const fakeToken = await MD5MD5(`${myToken}${timeTemp}`);

        download = Math.floor(((timestamp - Date.now()) / timestamp * total * 1099511627776) / 2);
        total *= 1099511627776;
        let expire = Math.floor(timestamp / 1000);
        subUpdateTime = env.SUBUPTIME || subUpdateTime;

        let combinedLinks = await addIpText(`${mainData}\n${urls.join('\n')}`);
        let { selfBuiltNodes, subscriptionLinks } = splitLinks(combinedLinks);

        // console.log(`urls: ${urls} \n mainData: ${mainData} \n userAgent: ${userAgent}`); 
        // console.log(`selfBuiltNodes: ${selfBuiltNodes} \n subscriptionLinks: ${subscriptionLinks} `);

        if (!isValidToken(token, fakeToken, url.pathname)) {
            await handleInvalidAccess(request, url, userAgent, enableTG);
            return new Response(await nginx(), { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
        } else {
            await sendMessage(`获取订阅 ${fileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}`);
            const subscriptionFormat = determineSubscriptionFormat(userAgent, url);
            const subscriptionConversionURL = `${url.origin}/${await MD5MD5(fakeToken)}?token=${fakeToken}`;

            const subLinksNodes = await fetchUrls(urls, subscriptionConversionURL, userAgent);
            //console.log(`subLinksNodes: ${subLinksNodes} `);
            const uniqueResult = getUniqueLines(subLinksNodes, selfBuiltNodes);
            //console.log(`uniqueResult: ${uniqueResult} `);
            const response = await handleSubscriptionFormat(subscriptionFormat, uniqueResult, subscriptionConversionURL, expire);
            return response;
        }
    }
};

function splitLinks(links) {
    let selfBuiltNodes = "", subscriptionLinks = "";
    for (let link of links) {
        if (link.toLowerCase().startsWith('http')) {
            subscriptionLinks += `${link}\n`;
        } else {
            selfBuiltNodes += `${link}\n`;
        }
    }
    return { selfBuiltNodes, subscriptionLinks };
}

function isValidToken(token, fakeToken, pathname) {
    return token === myToken || token === fakeToken || pathname === `/${myToken}` || pathname.includes(`/${myToken}?`);
}

async function handleInvalidAccess(request, url, userAgent, enableTG) {
    if (enableTG == 1 && url.pathname !== "/" && url.pathname !== "/favicon.ico") {
        await sendMessage(`#异常访问 ${fileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}`);
    }
}

function determineSubscriptionFormat(userAgent, url) {
    if (userAgent.includes('null') || userAgent.includes('subconverter') || userAgent.includes('nekobox') || userAgent.includes('CF-FAKE-UA')) {
        return 'base64';
    } else if (userAgent.includes('clash') || (url.searchParams.has('clash') && !userAgent.includes('subconverter'))) {
        return 'clash';
    } else if (userAgent.includes('sing-box') || ((url.searchParams.has('sb') || url.searchParams.has('singbox')) && !userAgent.includes('subconverter'))) {
        return 'singbox';
    } else if (userAgent.includes('surge') || (url.searchParams.has('surge') && !userAgent.includes('subconverter'))) {
        return 'surge';
    } else if (userAgent.includes('Shadowrocket') || (url.searchParams.has('Shadowrocket') && !userAgent.includes('subconverter'))) {
        return 'ss';
    } else if (userAgent.includes('Quantumult') || (url.searchParams.has('Quantumult') && !userAgent.includes('subconverter'))) {
        return 'quanx';
    } else {
        return 'auto';
    }
    
}

async function fetchUrls(urls, subscriptionConversionURL, userAgent) {
    if (!urls || urls.length === 0) {
        return "";
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const responses = await Promise.allSettled(urls.map(url =>
        fetch(url, {
            method: 'get',
            headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;', 'User-Agent': `amclubs/am-cf-sub-rss ${userAgent}` },
            signal: controller.signal
        }).then(response => response.ok ? response.text() : "")
    ));

    clearTimeout(timeout);
    return responses
        .filter(response => response.status === 'fulfilled' && response.value)
        .map(response => base64Decode(response.value))
        .join('\n');
}

function getUniqueLines(subLinksNodes, selfBuiltNodes) {
    const uniqueSubLines = new Set(subLinksNodes.split('\n'));
    const uniqueSelfLines = new Set(selfBuiltNodes.split('\n'));
    return [...new Set([...uniqueSelfLines, ...uniqueSubLines])].join('\n');
}

async function handleSubscriptionFormat(format, result, subscriptionConversionURL, expire) {
    const base64Data = base64EncodeUnicode(result);
    const headers = {
        "content-type": "text/plain; charset=utf-8",
        "Profile-Update-Interval": `${subUpdateTime}`,
        "Subscription-Userinfo": `upload=${download}; download=${download}; total=${total}; expire=${expire}`,
    };

    if (format === 'base64') {
        return new Response(base64Data, { headers });
    } else {
        const subconverterUrl = getSubconverterUrl(format, subscriptionConversionURL);
        const subconverterResponse = await fetch(subconverterUrl);
        if (!subconverterResponse.ok) {
            return new Response(base64Data, { headers });
        }
        let subconverterContent = await subconverterResponse.text();
        if (format === 'clash') subconverterContent = await clashFix(subconverterContent);
        return new Response(subconverterContent, {
            headers: {
                "Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(fileName)}; filename=${fileName}`,
                ...headers,
            },
        });
    }
}

function base64EncodeUnicode(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
}

function base64DecodeUnicode(base64) {
    const binaryStr = atob(base64);
    const binaryLen = binaryStr.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
}


function getSubconverterUrl(format, subscriptionConversionURL) {
    return `${subProtocol}://${subConverter}/sub?target=${format}&url=${encodeURIComponent(subscriptionConversionURL)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
}

async function sendMessage(type, ip, additionalData = "") {
    if (botToken !== '' && chatID !== '') {
        let msg = "";
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        if (response.status == 200) {
            const ipInfo = await response.json();
            msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${additionalData}`;
        } else {
            msg = `${type}\nIP: ${ip}\n<tg-spoiler>${additionalData}`;
        }

        let url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`;
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
            }
        });
    }
}

function clashFix(content) {
    if (content.includes('wireguard') && !content.includes('remote-dns-resolve')) {
        let lines;
        if (content.includes('\r\n')) {
            lines = content.split('\r\n');
        } else {
            lines = content.split('\n');
        }

        let result = "";
        for (let line of lines) {
            if (line.includes('type: wireguard')) {
                const modifiedContent = `, mtu: 1280, udp: true`;
                const correctContent = `, mtu: 1280, remote-dns-resolve: true, udp: true`;
                result += line.replace(new RegExp(modifiedContent, 'g'), correctContent) + '\n';
            } else {
                result += line + '\n';
            }
        }

        content = result;
    }
    return content;
}

async function addIpText(envadd) {
    var addtext = envadd.replace(/[	"'|\r\n]+/g, ',').replace(/,+/g, ',');
    //console.log(addtext);
    if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
    if (addtext.charAt(addtext.length - 1) == ',') addtext = addtext.slice(0, addtext.length - 1);
    const add = addtext.split(',');
    //console.log(add);
    return add;
}




function base64Decode(str) {
    const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

async function MD5MD5(text) {
    const encoder = new TextEncoder();

    const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
    const firstPassArray = Array.from(new Uint8Array(firstPass));
    const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
    const secondPassArray = Array.from(new Uint8Array(secondPass));
    const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return secondHex.toLowerCase();
}

async function nginx() {
    const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
    return text;
}
