import './Dashboard.css'
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import DashboardContent from './DashboardContent/DashboardContent';
import DashboardGraphs from './DashboardGraphs/DashboardGraphs';
import { API_LIST, API_MODULES } from '../../API';

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('all');

  function deleteItem(deleteId) {
    fetch(API_LIST+"/"+deleteId, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(
      (result) => {
        const remainingItems = items.filter(item => item.id !== deleteId);
        setItems(remainingItems);
      },
      (error) => {
        setError(error);
      }
    );
  }

  function toggleDone(event, id, title, description, done, estimatedTime, story_Points, moduleId) {
    event.preventDefault();
    modifyItem(id, title, description, done, estimatedTime, story_Points, moduleId).then(
      (result) => { reloadOneIteam(id); },
      (error) => { setError(error); }
    );
  }

  function modifyItem(id, title, description, done, estimatedTime, story_Points, moduleId) {
    let data = {
      "title": title,
      "description": description,
      "estimatedTime": estimatedTime,
      "done": done,
      "story_Points": story_Points,
      "moduleId": moduleId
    };
    return fetch(API_LIST+"/"+id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    });
  }

  function reloadOneIteam(id){
    fetch(API_LIST+"/"+id)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const items2 = items.map(
            x => (x.id === id ? {
                ...x,
                'title':result.title,
                'description':result.description,
                'done': result.done,
                'creation_ts': result.creation_ts,
                'estimatedTime': result.estimatedTime,
                'story_Points': result.story_Points,
                'moduleId': result.moduleId
              } : x));
          setItems(items2);
        },
        (error) => {
          setError(error);
        });
  }
  
  function addItem(data){
    setInserting(true);
    fetch(API_LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    }).then(
      (result) => {
        var id = result.headers.get('location');
        var newItem = {
          "id": id,
          "title": data.title,
          "description": data.description,
          "estimatedTime": data.estimatedTime,
          "done": data.done,
          "story_Points": data.story_Points,
          "moduleId": data.moduleId
        }
        setItems([newItem, ...items]);
        setInserting(false);
      },
      (error) => {
        setInserting(false);
        setError(error);
      }
    );
  }

  function handleModuleChange(event) {
    setSelectedModule(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetch(API_LIST)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong loading the initial charge check useEffect ...');
          }
        })
        .then(
          (result) => {
            console.log("API Response HEREEEEEEEEEEEEE:", result);
            setItems(result);
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            setError(error);
          });
      
      fetch(API_MODULES)
        .then(response => response.ok ? response.json() : Promise.reject('Error fetching modules'))
        .then(result => setModules(result))
        .catch(error => setError(error));
    }

    fetchData();
  }, [refresh]);

  return (
      <div className='dashboard-main'>
        <div><h1>DEPLOYMENT</h1></div>
      </div>
  );
}