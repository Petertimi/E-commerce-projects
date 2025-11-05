import Flutterwave from 'flutterwave-node-v3'

let flw: any = null

export function getFlutterwave() {
  if (!flw) {
    const pub = process.env.FLW_PUBLIC_KEY
    const sec = process.env.FLW_SECRET_KEY
    if (!pub || !sec) throw new Error('Missing FLW_PUBLIC_KEY/FLW_SECRET_KEY')
    flw = new (Flutterwave as any)(pub, sec)
  }
  return flw
}







