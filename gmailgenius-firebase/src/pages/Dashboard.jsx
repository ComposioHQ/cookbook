import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SmallButton from "../components/smallButton";

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const navToAgent = () => {
        navigate("/agent");
    }

    return (
        <section className="min-h-screen bg-white dark:bg-gray-900 mt-12">
            <div className="text-lg text-center mt-44">
                No Triggers found...
            </div>
            <div className="mt-44 flex flex-col items-center m-auto">
                <SmallButton name="Add Trigger" action={navToAgent} width="8rem"/>
            </div>
        </section>
    );
};

export default Dashboard;