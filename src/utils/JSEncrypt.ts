import JSEncrypt from 'jsencrypt';
import config from '@/config/config';

let encrypt = new JSEncrypt();
encrypt.setPublicKey(config.publicKey);
export default encrypt;
