import { z } from 'zod';
import { NextRequest } from "next/server";
import { ZOD_VALIDATION_ERROR } from './constants';

type DateParams = {
  fromDate: string;
  toDate: string;
};

type RequiredParams = {fromDate: boolean, toDate: boolean};

const schema = (required: RequiredParams) => z.object({
  fromDate: z.string().nullable().refine(value => value ? !isNaN(Date.parse(value)) : true, {
    message: 'fromDate must be a valid date string',
  }),
  toDate: z.string().nullable().refine(value => value ? !isNaN(Date.parse(value)) : true, {
    message: 'toDate must be a valid date string',
  }),
}).superRefine(({fromDate, toDate}, ctx) => {
  if(required.fromDate && !fromDate){
    ctx.addIssue({
      code: "custom",
      message: "fromDate is required!",
      path: ["fromDate"]
    });
  }else if(required.toDate && !toDate){
    ctx.addIssue({
      code: "custom",
      message: "toDate is required!",
      path: ["toDate"]
    });
  }
});

export function getDateParams(request: NextRequest, required: RequiredParams = {fromDate: false, toDate: false}): DateParams {
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const from = String(urlParams.get('fromDate') || '');
  const to = String(urlParams.get('toDate') || '');

  // Validate the query parameters
  const result = schema(required).safeParse({ fromDate: from, toDate: to });
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.errors),{cause: ZOD_VALIDATION_ERROR});
  }

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
