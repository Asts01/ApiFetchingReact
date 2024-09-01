import { useEffect, useState } from 'react';
import './App.css';

function App() {
  //slected ids and names via check-box
  const [slectedValues, addSelectedValues] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [perPageNo, updatePerPageNo] = useState(10);//drop-down for no of entries per page
  const [loading, setLoading] = useState(true);//show loading initially while the page is loading
  const [data, setData] = useState([]);//load the data initially from API
  const [page, setPage] = useState(1);//set the current page-no

  const URL = `https://randomuser.me/api/?results=100`;

  const getData = async () => {
    const response = await fetch(URL);
    const result = await response.json();
    setData(result.results);
    setLoading(false);
  };

  const incPage = () => {
    setPage(page + 1);
  };

  const decPage = () => {
    if (page - 1 > 0) {
      setPage(page - 1);
    } else {
      alert("Can't decrease page number beyond 1");
    }
  };

  const includeValue = (id, name) => {
    // Check if the value is already existing
    const exists = slectedValues.some(item => item.id === id);
    if (exists) {
      // Remove the selected value and name
      addSelectedValues(slectedValues.filter(item => item.id !== id));
      setSelectedNames(selectedNames.filter(item => item !== name));
    } else {
      // Add the selected value and name
      addSelectedValues([...slectedValues, { id }]);
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleChange = (e) => {
    updatePerPageNo(Number(e.target.value));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className='w-screen'>
        <div className='flex justify-center p-2'>
          <label>PerPageCount: </label>
          <select
            value={perPageNo}
            onChange={handleChange}
            className='bg-pink-300 mx-2'>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className='flex justify-center py-2 bg-pink-200'>
          <div className='flex'>Selected Count :  <div className='px-1 bg-pink-400'>{slectedValues.length}</div></div>
        </div>
        <div className='flex py-2 align-center'>
          <div>Selected Names: <div>{selectedNames.join(', ')}</div></div> 
        </div>
        <table className='w-screen table-auto mb-20'>
          <thead className='bg-red-300'>
            <tr>
              <th className='p-2 border'>Select</th>
              <th className='p-2 border'>Profile</th>
              <th className='p-2 border'>Name</th>
              <th className='p-2 border'>Gender</th>
              <th className='p-2 border'>Email</th>
              <th className='p-2 border'>Dob</th>
              <th className='p-2 border'>Phone</th>
            </tr>
          </thead>
          
          <tbody>
            {!loading && data.length > 0 ? (
              data.slice((page - 1) * perPageNo, page * perPageNo).map((user, index) => (
                <tr key={index} className='hover:bg-gray-200'>
                  <td className='p-2 border'>
                    <input
                      type="checkbox"
                      checked={slectedValues.some(item => item.id === user.login.uuid)}
                      onChange={() => includeValue(user.login.uuid, user.name.first + ' ' + user.name.last)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <img src={user.picture.thumbnail} alt="" />
                  </td>
                  <td className='p-2 border'>{user.name.first + ' ' + user.name.last}</td>
                  <td className='p-2 border'>{user.gender}</td>
                  <td className='p-2 border'>{user.email}</td>
                  <td className='p-2 border'>{new Date(user.dob.date).toLocaleDateString()}</td>
                  <td className='p-2 border'>{user.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className='p-2 text-center'>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className='fixed bottom-0 py-[20px] flex items-center justify-center bg-red-200 w-full'>
          <button onClick={decPage} className='bg-pink-300'>◀ Previous</button>
          <div className='mx-4'>PageNo: {page}</div>
          <button onClick={incPage} className='bg-pink-300'>Next ▶</button>
        </div>
      </div>
    </>
  );
}

export default App;