import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]); // Ensure resumeList is initialized as an empty array
  const [loading, setLoading] = useState(true); // Loading state to manage fetch status

  useEffect(() => {
    if (user) {
      GetResumesList();
    }
  }, [user]);

  /**
   * Fetches the user's resume list.
   */
  const GetResumesList = () => {
    setLoading(true); // Start loading
    GlobalApi.GetUserResumes(user?.emailAddress)
    
      .then((resp) => {
        const resumes = resp?.data?.data || [];
        setResumeList(resumes);
      })
      .catch((error) => {
        console.error('Error fetching resumes:', error);
        setResumeList([]); // Reset to an empty array on error
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating an AI resume for your next job role</p>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10"
      >
        <AddResume />
        {loading ? (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            ></div>
          ))
        ) : resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={index}
              refreshData={GetResumesList}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No resumes found. Start by adding one!
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
