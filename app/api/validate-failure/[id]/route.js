import { NextResponse } from "next/server";


export async function POST(
  request,
  { params }
) {

  try {


    const { id } = await params;



    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImMyZmI4NGI3LTAzNGMtNDY2Ny04YzM0LTk2NjIyMzZhOWI0MSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Ik1vaGFtbWFkLkJvcmluaUBlZnNtZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTW9oYW1tYWQgIEJvcmluaSIsIlVzZXJUeXBlIjoiU2VydmljZVByb3ZpZGVyIiwiUm9sZUlkIjoiNDUiLCJSb2xlTmFtZSI6IlN1cGVydmlzb3IiLCJTZXJ2aWNlUHJvdmlkZXJJZCI6IjMiLCJTZXJ2aWNlUHJvdmlkZXJOYW1lIjoiRUZTIiwiUHJpdmlsZWdlIjpbIlZpZXdVc2VycyIsIlZpZXdGYWlsdXJlcyIsIkVkaXRGYWlsdXJlcyIsIlZpZXdLUElzIiwiVmlld1JvbGVzIiwiVmlld1pvbmVzIiwiVmlld0NvbXBsYWludHMiLCJNYW5hZ2VGaWVsZEVtcGxveWVlRGlzdHJpY3RzIl0sImV4cCI6MTc4NzcyODYyMywiaXNzIjoiUW1zSXNzdWVyIiwiYXVkIjoiUW1zQXVkaWVuY2UifQ.pXSnU9lfWQzIuMjcDEPvOsGyhLFc9yW7tyJt9WXWtZo";



    if (!token) {

      return NextResponse.json(
        {
          error: "Token missing"
        },
        {
          status: 500
        }
      );

    }



    const response = await fetch(

      `https://api.avtr.jo/api/service-provider/failures/${id}/validate`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Authorization": `Bearer ${token}`

        },

        body: JSON.stringify({

          accepted: true

        })

      }

    );




    const data = await response.json();



    return NextResponse.json(

      data,

      {
        status: response.status
      }

    );



  }

  catch(error) {


    console.log(error);



    return NextResponse.json(

      {
        error: "Server error",
        message: error.message
      },

      {
        status:500
      }

    );


  }

}