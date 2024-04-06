import { NextRequest } from "next/server";

type DateParams = {
  fromDate: string;
  toDate: string;
};

export function getDateParams(request: NextRequest): DateParams {
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const from = String(urlParams.get('fromDate') || '');
  const to = String(urlParams.get('toDate') || '');

  const dates = {
    fromDate: '',
    toDate: '',
  }

  if(from){
    dates.fromDate = new Date(from).toISOString();
  }

  if(to) {
    dates.toDate = new Date(to).toISOString();
  }

  return dates;
}
