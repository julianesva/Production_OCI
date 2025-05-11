import './ReportContent.css';
import { useState, useEffect } from 'react';
import ReportKPI from './ReportKPI/ReportKPI';

export default function ReportContent({ data, moduleData }) {
    const [teamFilter, setModuleFilter] = useState('default');
    const [memberFilter, setMemberFilter] = useState('all');
    const [sprintFilter, setSprintFilter] = useState('all');
    const [teamsAvailable, setTeamsAvailable] = useState([]);
    const [membersAvailable, setMembersAvailable] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            const uniqueTeams = new Set(data.map(item => item.teamId));
            const uniqueMembers = new Set(data.map(item => item.user.username));
            setTeamsAvailable(Array.from(uniqueTeams));
            setMembersAvailable(Array.from(uniqueMembers));
        } else {
            setTeamsAvailable([]);
        }
    }, [data]);

    return (
        <div className='report-main-content-container'>
            {/* Title Container */}
            <div className='report-title-container'>
                {/* Title Text */}
                <p className='report-title-text'>Report</p>
            </div>

            {/* Report Selects Team & Member */}
            <div className="filter-team-member-container">
                {/* Select Team */}
                <div className="filter-container">
                    <p className='filter-title-text'>Team:</p>
                    <select className='filter-select' value={teamFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                        <option value="default" selected>Select a Team</option>
                        {teamsAvailable.map((team, index) => (
                            <option key={index} value={team}>
                                {team}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Member */}
                {teamFilter != 'default' &&
                    <div className="filter-container">
                        <p className='filter-title-text'>Member:</p>
                        <select className='filter-select' value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
                            <option value="all" selected>All</option>
                            {membersAvailable.map((member, index) => (
                                <option key={index} value={member}>
                                    {member}
                                </option>
                            ))}
                        </select>
                    </div>
                }
            </div>

            {/* Select Sprint */}
            <div className="filter-container select-sprint-container">
                <p className='filter-title-text'>Sprint:</p>
                <select className='filter-select' value={sprintFilter} onChange={(e) => setSprintFilter(e.target.value)}>
                    <option value="all" selected>All</option>
                    {moduleData &&
                        [...moduleData]
                            .sort((a, b) => a.id - b.id)
                            .map((module) => (
                                <option key={module.id} value={module.id}>
                                    {module.id} - {module.name}
                                </option>
                            ))
                    }
                </select>
            </div>

            {/* Report KPI's */}
            <ReportKPI data={data} moduleData={moduleData} teamFilter={teamFilter} memberFilter={memberFilter} sprintFilter={sprintFilter} />
        </div>
    );
}