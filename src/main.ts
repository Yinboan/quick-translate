import * as https from "https"; 
import * as querystring from "querystring";
import {appid,secret} from './private';
const md5 = require('md5')

type ErrorMap = {
    [k:string]:string
}
let errorMap:ErrorMap = {
    '52000':'成功', 	
    '52001':'请求超时', 	
    '52002':'系统错误 ',	
    '52003':'未授权用户 ',	
    '54000':'必填参数为空', 	
    '54001':'签名错误 ',	
    '54003':'访问频率受限 ',	
    '54004':'账户余额不足 ',	 
    '54005':'长query请求频繁 ',	 
    '58000':'客户端IP非法', 	
    '58001':'译文语言方向不支持',
    '58002':'服务当前已关闭', 	 
    '90107':'认证未通过或未生效'
}
const translate = (word:string)=>{
    if(typeof word !== 'string'){
        word='undefined'
    }

    let salt = 1,//Math.random(),
        sign = md5(appid+word+salt+secret),
        from,to;

    if(/^[a-zA-Z]$/.test(word[0])){
    //英译中
        from='en';
        to='zh'
    }else{
    //中译英
        from='zh';
        to='en';
    }        
    const query = querystring.stringify({
        q:word,
        from:from,
        to:to,
        appid:appid,
        salt:salt,
        sign:sign
    })

    const options={
        hostname:'api.fanyi.baidu.com',
        prot:443,
        path:'/api/trans/vip/translate?'+query,
        method:'get'
    }
    // console.log(query)
    const req = https.request(options,(request)=>{
        let chunks:Buffer[] = []
        request.on('data',(val)=>{
            chunks.push(val)
        })
        request.on('end',()=>{
            let data:string = Buffer.concat(chunks).toString()
            // console.log(data);
            type queryRes={
                from:string,
                to:string,
                trans_result:{src:string,dst:string}[],
                error_code:string,
                error_msg?:string
            }

            let obj:queryRes = JSON.parse(data)

            if(obj.error_code){
                console.error('出错了：'+errorMap[+obj.error_code])
                process.exit(-1)
            }else{
                // console.log(obj.trans_result);
                let res = obj.trans_result[0]
                console.log(`${res.src} => ${res.dst}`);
                process.exit(0)
            }
        })
    })
    req.end()
}
export {translate}