import React from "react";

const PaymentConfirmation=React.lazy(()=>import("@/components/PaymentConfirmation/PaymentConfirmation"));
interface PageProps {
    params: {
        Id: string;
    };
}

const PaymentDetail = ({ params }: PageProps) => {
  return (
    <div>
     <PaymentConfirmation/>
    </div>
  )
}
export default PaymentDetail;
