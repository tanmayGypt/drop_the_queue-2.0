import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { PropagateLoader } from "react-spinners";

function GuestOtherDetails() {
  const [Loader, ShowLoader] = useState(false);

  let uuid = uuidv4();

  const [GuestId, SetGuestId] = useState(null);
  const [RoomNumber, SetRoomNumber] = useState(0);
  const [Customer_Name, SetCustomer_Name] = useState("");
  const [Checked_In_Date, SetChecked_In_Date] = useState(null);
  const [Checked_Out_Date, SetChecked_Out_Date] = useState(null);
  const [IdentityType, SetIdentityType] = useState(null);
  const [IdentityNumber_Hashed, SetIdentityNumber_Hashed] = useState(null);
  const [MobileNumber, SetMobileNumber] = useState(0);
  const [RoomId, SetRoomId] = useState(null);
  const param = useParams();
  const ParamRoomId = param.GuestId;
  useEffect(() => {
    const DataFetcher = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASEURL
          }/Guests/FetchGuestById/${ParamRoomId}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        console.log(data);
        console.log(ParamRoomId);
        SetRoomId(response.data.RoomId);
        SetRoomNumber(response.data.RoomNumber);
        SetCustomer_Name(response.data.Customer_Name);
        SetChecked_In_Date(response.data.Checked_In_Date);
        SetGuestId(response.data.GuestId);
        SetIdentityType(response.data.IdentityType);
        SetIdentityNumber_Hashed(response.data.IdentityNumber_Hashed);
        SetMobileNumber(response.data.MobileNumber);
        toast.success(`Guest ${Customer_Name} Fetched Succesfully`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch guest details");
      }
    };
    DataFetcher();
  }, []);

  const UpdateHandler = async () => {
    const confirmation = confirm(
      `Are You sure want to update ${Customer_Name} details ?`
    );
    console.log(GuestId, ParamRoomId, Checked_Out_Date);
    if (!Checked_Out_Date) {
      toast.error("Please provide the checkout date");
      return;
    }

    try {
      ShowLoader(true);

      // Delete the guest by ID
      const deleteResponse = await axios.get(
        `${import.meta.env.VITE_BASEURL}/Guests/DeleteGuestById/${ParamRoomId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Delete API Called");
      toast.success("Data Guest Moving to Room History Transaction");

      if (deleteResponse.status !== 200) {
        throw new Error("Failed to delete guest");
      }

      // Update the room details
      const updateRoomResponse = await axios.post(
        `${import.meta.env.VITE_BASEURL}/Rooms/UpdateRoom/${ParamRoomId}`,
        {
          isOccupied: false,
          MobileNumber: null,
          Customer_Name: null,
          GuestId: null,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Update Room API called");
      toast.success(`Room ${RoomNumber} is now Available for occupation`);

      if (updateRoomResponse.status !== 200 || updateRoomResponse.data?.name) {
        throw new Error("Failed to update room details");
      }

      // Add new occupation transaction
      const transactionResponse = await axios.post(
        `${
          import.meta.env.VITE_BASEURL
        }/Room_Occupation_Transaction/AddNewOccupation`,
        {
          OccupationId: uuid,
          RoomId,
          GuestId,
          Checked_In_Date,
          Checked_Out_Date,
          Customer_Name,
          IdentityType,
          IdentityNumber_Hashed,
          MobileNumber,
          RoomNumber: RoomNumber,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Occupation created");
      if (transactionResponse.status !== 200) {
        throw new Error("Failed to add new occupation transaction");
      }

      toast.success("Data updated successfully, Please Move further");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing the request");
    } finally {
      ShowLoader(false);
    }
  };

  return (
    <>
      <div className="w-6/12 mx-auto">
        <div>
          <Toaster />
        </div>
        {Loader && (
          <div className="mx-auto flex flex-col gap-y-12 justify-center my-10">
            <div className="mx-auto">
              <PropagateLoader color="#36d7b7" />
            </div>
          </div>
        )}
        <div
          className={`max-w-sm mx-auto py-8 px-8 bg-white rounded-xl flex flex-col shadow-md animate-fade-in-down gap-y-2 ${
            Loader ? "opacity-50" : ""
          }`}
        >
          <h1 className="text-3xl font-normal text-center">Customer Details</h1>
          <h1 className="flex justify-between font-bold my-3">
            Room Number:{" "}
            <input
              className="font-normal text-end"
              type="text"
              value={RoomNumber}
              disabled
            />
          </h1>
          <hr />
          <div className="flex flex-col gap-y-2">
            <h1 className="flex justify-between font-bold">
              Customer Name:{" "}
              <input
                className="font-normal text-end"
                type="text"
                value={Customer_Name}
                disabled
              />
            </h1>
            <hr />
            <h1 className="flex justify-between font-bold">
              Check In Date:{" "}
              <input
                className="font-normal text-end"
                type="text"
                value={Checked_In_Date}
                disabled
              />
            </h1>
            <hr />
            <h1 className="flex justify-between font-bold">
              Check Out Date:{" "}
              <input
                className="font-normal text-end"
                type="date"
                value={Checked_Out_Date || ""}
                onChange={(e) => SetChecked_Out_Date(e.target.value)}
              />
            </h1>
            <hr />
            <h1 className="flex justify-between font-bold">
              Identity Type:{" "}
              <input
                className="font-normal text-end"
                type="text"
                value={IdentityType}
                disabled
              />
            </h1>
            <hr />
            <h1 className="flex justify-between font-bold">
              Identity Number:{" "}
              <input
                className="font-normal text-end"
                type="text"
                value={IdentityNumber_Hashed}
                disabled
              />
            </h1>
            <h1 className="flex justify-between font-bold">
              Phone Number:{" "}
              <input
                className="font-normal text-end"
                type="text"
                value={MobileNumber}
                disabled
              />
            </h1>
            <hr />
          </div>
          <button
            onClick={UpdateHandler}
            className="text-center my-4 justify-center w-auto px-8 py-3 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-md cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default GuestOtherDetails;
