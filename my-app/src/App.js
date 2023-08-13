import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import playerData from './playerdata.json';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';
import { Radar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, RadarController, registerables, PieController, ArcElement, Tooltip, Legend} from 'chart.js';
import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { Chart as AutoChart, BarController, BarElement, CategoryScale } from 'chart.js/auto';

Chart.register(RadialLinearScale, PointElement, LineElement, RadarController);

const Homepage = () => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Change this to false if you want the animation to trigger again whenever it comes in view
    threshold: 0.9,
  });
  
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(-2,1,1);
    camera.rotation.x = - Math.PI / 3;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const parameters = {
      count: 100000,
      color: 0xffffff,
      insideColor: 0x333399,
      outsideColor: 0xff0000,
      size: 0.001,
      radius: 10,
      branches: 16,
      spin: -1,
      randomness: 0.8,
      randomnessPower: 7
    };

    let particlesGeometry = null;
    let particlesMaterial = null;
    let galaxy = null;

    const galaxyGenerator = () => {
      if(galaxy !== null) {
        particlesMaterial.dispose();
        particlesGeometry.dispose();
        scene.remove(galaxy);
      }

      particlesGeometry = new THREE.BufferGeometry();
      const count = parameters.count;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3); 
      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for(let i = 0; i < count * 3; i++) {
        let i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchesAngle =  ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1); 
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        positions[i3 + 0] =  Math.cos(branchesAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius  + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesMaterial = new THREE.PointsMaterial({
        color: parameters.color, 
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      galaxy = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(galaxy);
    };

    galaxyGenerator();

    window.addEventListener('resize', () => {
      // Update camera's aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      // Update renderer size
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      galaxy.rotation.y += 0.0005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    mountRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      // Update camera's aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      // Update renderer size
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Existing code...
  
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        if (galaxy !== null) {
          particlesMaterial.dispose();
          particlesGeometry.dispose();
          scene.remove(galaxy);
        }
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const refHome3 = useRef(null);

  const handleClick = () => {
    refHome3.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage">
      <div ref={mountRef} className="background" />
      <div className="overlay-text">
        <h1>This is Stats Reimagined.</h1>
        <p>Puck delivers a hockey fantasy application experience like no other.</p>
      </div>
      <img src={process.env.PUBLIC_URL + '/tools.png'} alt="Tools" className="tools-image" onClick={handleClick}/>      <div className="home1-container" ref={ref}>
        <Link to="/fantasy" className="home1-image">
          <img src={process.env.PUBLIC_URL + '/home1.png'} alt="Home1" className={"home1-image" + (inView ? " animate" : "")} />
        </Link>
        <h2>The FantasyApp is a React component that powers an application for sorting and ranking players based on user-defined weightages of different statistics. This application is particularly useful for fantasy hockey players, as it allows users to customize the importance of different stats when evaluating player performance.</h2>
      </div>
      <div className="home2-container" ref={ref}>
        <Link to="/roster" className="home2-image">
          <img src={process.env.PUBLIC_URL + '/home2.png'} alt="Home2" className={"home2-image" + (inView ? " animate" : "")} />
        </Link>
        <h3>In the Roster Overview component you can easily search and select players to form your team that you need to analyze. Just type a player's name into the search bar, and you'll get top suggestions based on your input. By clicking on a suggested player, they'll instantly join your team. Each player added or removed automatically updates your team's average statistics in real-time, giving you a clear view of your team's strengths and weaknesses. Tailor your team to perfection and dominate your fantasy league.</h3>
      </div>
      <div className="home3-container" ref={refHome3}>
        <Link to="/trade" className="home3-image">
          <img src={process.env.PUBLIC_URL + '/home3.png'} alt="Home3" className={"home3-image" + (inView ? " animate" : "")} />
        </Link>
        <h4>In Trade Analyzer you can seamlessly add players to either of the two sides of a trade by searching for their names. You'll get a list of top suggestions from which you can make your selection. If a trade doesn't work out as expected, worry not - you can remove players with a simple click. Compare stats, make better trades, and get ahead in your league with our Trade Analyzer</h4>
      </div>
    </div>
  );
};

const FantasyApp = () => {
  const [selectedStats, setSelectedStats] = useState([]);
  const [statWeights, setStatWeights] = useState({});
  const [manualStatWeights, setManualStatWeights] = useState({});
  const [weightedStats, setWeightedStats] = useState(false);
  const [minMaxSorting, setMinMaxSorting] = useState(false);
  const [playerDataCopy, setPlayerDataCopy] = useState([]);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState({
    LW: true,
    C: true,
    RW: true,
    D: true,
  });

  const statsOptions = [
    { shortForm: "G", longForm: "goals" },
    { shortForm: "A", longForm: "assists" },
    { shortForm: "PTS", longForm: "points" },
    { shortForm: "+/-", longForm: "plusMinus" },
    { shortForm: "PIM", longForm: "penaltyMinutes" },
    { shortForm: "PPG", longForm: "powerplayGoals" },
    { shortForm: "PPP", longForm: "powerplayPoints" },
    { shortForm: "SHG", longForm: "shorthandedGoals" },
    { shortForm: "SHP", longForm: "shorthandedPoints" },
    { shortForm: "GWG", longForm: "gameWinningGoals" },
    { shortForm: "SOG", longForm: "shotsOnGoal" },
    { shortForm: "S%", longForm: "shootingPercentage" },
    { shortForm: "FW", longForm: "faceoffsWon" },
    { shortForm: "HIT", longForm: "hits" },
    { shortForm: "BLK", longForm: "blocks" },
    { shortForm: "TOI/GP", longForm: "timeOnIcePerGame" },
    { shortForm: "TOI", longForm: "totalTimeOnIce" },
  ];

  const timeToSeconds = (time) => {
    if (typeof time === "string") {
      const [minutes, seconds] = time.split(':').map(Number);
      return (minutes * 60) + seconds;
    } else {
      console.warn(`Expected time to be a string, but received ${typeof time}`);
      return 0;
    }
  };

  const secondsToTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const normalizeValue = (value, min, max) => {
    return (value - min) / (max - min);
  };

  useEffect(() => {
    // Create a deep copy of playerData
    const copy = JSON.parse(JSON.stringify(playerData));

    // Filter out players with position G or goalie
    const nonGoaliePlayers = copy.filter(
      player => player.position.toUpperCase() !== "G" && player.position.toLowerCase() !== "goalie"
    );

    // Normalize Time On Ice data to seconds in the copy for calculations and sorting
    nonGoaliePlayers.forEach(player => {
      player.timeOnIcePerGame = timeToSeconds(player.timeOnIcePerGame);
      player.totalTimeOnIce = timeToSeconds(player.totalTimeOnIce);
    });

    setPlayerDataCopy(nonGoaliePlayers);

    // Calculate weights based on playerDataCopy
    const calculateWeights = () => {
      const weights = {};
      statsOptions.forEach(({ longForm }) => {
        let total = 0;
        let totalTOI = 0;
        nonGoaliePlayers.forEach(player => {
          total += player[longForm];
          totalTOI += player.totalTimeOnIce;
        });
        weights[longForm] = total / totalTOI;
      });
      setStatWeights(weights);
    };

    calculateWeights();

    // Reset manualStatWeights to default when weightedStats is true
    if (weightedStats) {
      const defaultWeights = {};
      statsOptions.forEach(({ longForm }) => {
        defaultWeights[longForm] = 1;
      });
      setManualStatWeights(defaultWeights);
    }
    if (minMaxSorting) {
      statsOptions.forEach(({ longForm }) => {
        const allValues = nonGoaliePlayers.map(player => player[longForm]);
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        nonGoaliePlayers.forEach(player => {
          player[longForm] = normalizeValue(player[longForm], minValue, maxValue);
        });
      });
    }
  }, [playerData, weightedStats, minMaxSorting]);

  const handleStatWeightChange = (stat, event) => {
    const weight = event.target.value;
    const statOption = statsOptions.find(option => option.longForm === stat);
  
    if (statOption) {
      const { shortForm } = statOption;
  
      setSelectedStats(prevStats => {
        if (weight > 1 && !prevStats.includes(shortForm)) {
          return [...prevStats, shortForm];
        } else if (weight <= 1 && prevStats.includes(shortForm)) {
          return prevStats.filter(s => s !== shortForm);
        } else {
          return prevStats;
        }
      });
  
      setManualStatWeights(prevWeights => ({ ...prevWeights, [stat]: weight }));
    }
  };

  const toggleWeightedStats = () => {
    setWeightedStats(!weightedStats);
  };

  const toggleMinMaxSorting = () => {
    setMinMaxSorting(!minMaxSorting);
  };

  const sortedPlayers = playerDataCopy
.filter(player => selectedPositions[player.position])
.sort((a, b) => {
  // Common logic to compute the weighted sum for a player
  const computeWeightedSum = (player) => {
    return selectedStats.reduce((total, stat) => {
      const longForm = statsOptions.find(option => option.shortForm === stat).longForm;
      const weight = weightedStats ? statWeights[longForm] : (manualStatWeights[longForm] || 1);
      const value = player[longForm];
      return total + value * weight;
    }, 0);
  };

  const aTotal = computeWeightedSum(a);
  const bTotal = computeWeightedSum(b);

  return bTotal - aTotal;  // As per your logic, higher values come first
});

  const topPlayers = sortedPlayers.slice(0, 100);

  const selectedStatLongForms = selectedStats.map(stat => statsOptions.find(option => option.shortForm === stat).longForm);

  const camelCaseToRegular = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
      .replace(/^./, function(str){ return str.toUpperCase(); }); // capitalize the first letter - optional
  };  

  const getReadableStatName = (key) => {
    const statOption = statsOptions.find(option => option.longForm === key);
    return statOption ? camelCaseToRegular(statOption.longForm) : key;
  };  

  const handlePositionChange = (position) => {
    setSelectedPositions(prev => ({ ...prev, [position]: !prev[position] }));
  };

  const formatValue = (value) => {
    // If the value is a number and between 0 and 1 (decimal), round it to 4 decimal places.
    if (typeof value === 'number' && value > 0 && value < 1) {
      return value.toFixed(4);
    }
    return value;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-description">
          <h2>
            This app allows you to calculate and compare different player stats based on weightage.
            The sliders allow you to select different statistics and assign weight to each,
            which is then used to sort the players. This tool can be a great way to assess
            player performance in a more personalized and in-depth manner. Use the switch to toggle
            between <u>default stat sorting</u> and <u>min-max normalization sorting</u>. Use the checkboxes
            to toggle between desired positions.
          </h2>
        </div>
        <div className="stats-options-banner">
          {statsOptions.map(({ shortForm, longForm }) => (
            <label key={longForm} title={longForm}>
              {shortForm}
              <input
                type="range"
                min="1"
                max="5"
                value={manualStatWeights[longForm] || 1}
                onChange={(event) => handleStatWeightChange(longForm, event)}
              />
            </label>
          ))}
        </div>
        <div className="position-filters">
          {Object.entries(selectedPositions).map(([pos, isChecked]) => (
            <div key={pos}>
              <input
                type="checkbox"
                id={`position-${pos}`}
                checked={isChecked}
                onChange={() => handlePositionChange(pos)}
              />
              <label htmlFor={`position-${pos}`}>{pos}</label>
            </div>
          ))}
        </div>
        <div className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={minMaxSorting}
              onChange={toggleMinMaxSorting}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">
            {minMaxSorting ? "Min/Max Sorting" : "Default Sorting"}
          </span>
        </div>
        <div className="top-players">
        {topPlayers.map(player => (
            <div
              className="player-card"
              key={player.id}
              onMouseEnter={() => setHoveredPlayer(player)}
              onMouseLeave={() => setHoveredPlayer(null)}
            >
              {hoveredPlayer === player && (
                <div className="player-chart-container">
                  <div className="player-stats-chart">
                  <PlayerStatsChart player={hoveredPlayer} selectedStatLongForms={selectedStatLongForms} selectedStatShortForms={selectedStats} />
                  </div>
                </div>
              )}
              <img
                src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
                alt={player.name}
                onError={event => (event.target.src = process.env.PUBLIC_URL + '/headshots/default.png')}
                style={{ width: '100%', height: '200px' }}
              />
              <h2>{player.name}</h2>
              {Object.entries(player).filter(([key]) => !["img", "name", "powerplayAssists", "shorthandedAssists", "faceoffsLost"].includes(key)).map(([key, value]) => {
                  value = formatValue(value);  // Apply the format here
                  
                  if(key === "team" || key === "position") {
                    return <h3 key={key}>{value}</h3>;
                  }
                  else {
                    let displayValue;
                    if (minMaxSorting && (key === "timeOnIcePerGame" || key === "totalTimeOnIce")) {
                      // If minMaxSorting is active and the key is one of the two specified stats,
                      // directly use the value, which should now be a normalized decimal.
                      displayValue = value;
                    } else {
                      displayValue = (key === "timeOnIcePerGame" || key === "totalTimeOnIce") ? secondsToTime(value) : value;
                    }

                    return <h3
                      key={key}
                      style={{
                        fontSize: selectedStatLongForms.includes(key) ? "24px" : "14px",
                        fontWeight: selectedStatLongForms.includes(key) ? "bold" : "normal",
                      }}
                    >
                      {getReadableStatName(key)}: {displayValue}
                    </h3>; 
                  }
                })}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

const RosterOverview = () => {
  const [team, setTeam] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [statAverages, setStatAverages] = useState({});
  const [suggestedPlayers, setSuggestedPlayers] = useState([]);
  const [displayedStats, setDisplayedStats] = useState({});
  const [statMode, setStatMode] = useState("average"); // New state variable to handle switching of stat mode
  const [hoverStatKey, setHoverStatKey] = useState(null);
  const [hoverStatValue, setHoverStatValue] = useState(null);

  const excludedStats = ["position", "powerplayAssists", "shorthandedAssists", "faceoffsLost"];

  const statsOptions = [
    { shortForm: "G", longForm: "goals" },
    { shortForm: "A", longForm: "assists" },
    { shortForm: "PTS", longForm: "points" },
    { shortForm: "+/-", longForm: "plusMinus" },
    { shortForm: "PIM", longForm: "penaltyMinutes" },
    { shortForm: "PPG", longForm: "powerplayGoals" },
    { shortForm: "PPP", longForm: "powerplayPoints" },
    { shortForm: "SHG", longForm: "shorthandedGoals" },
    { shortForm: "SHP", longForm: "shorthandedPoints" },
    { shortForm: "GWG", longForm: "gameWinningGoals" },
    { shortForm: "SOG", longForm: "shotsOnGoal" },
    { shortForm: "S%", longForm: "shootingPercentage" },
    { shortForm: "FW", longForm: "faceoffsWon" },
    { shortForm: "HIT", longForm: "hits" },
    { shortForm: "BLK", longForm: "blocks" },
    { shortForm: "TOI/GP", longForm: "timeOnIcePerGame" },
    { shortForm: "TOI", longForm: "totalTimeOnIce" },
  ];  

  const filteredPlayers = playerData.map((player, index) => ({
    ...player,
    id: index,
  })).filter((player) =>
    player.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const addPlayer = (player) => {
    setTeam([...team, player]);
    setSearchValue('');
    setSuggestedPlayers([]);
  };
  
  const removePlayer = (playerIndex) => {
    setTeam(prevTeam => {
      return prevTeam.filter((player) => player.id !== playerIndex);
    });
  };

  useEffect(() => {
    const calculateAverages = () => {
      const statTotals = team.reduce((totals, player) => {
        Object.entries(player).forEach(([key, value]) => {
          if (key !== 'name' && key !== 'img' && key !== 'team' && key !== 'id' && !excludedStats.includes(key)) {
            // Check if the stat is a time format
            if (key === 'timeOnIcePerGame' || key === 'totalTimeOnIce') {
              let [minutes, seconds] = value.split(":").map(Number);
              if (!totals[key]) {
                totals[key] = {minutes: 0, seconds: 0, count: 0};
              }
              totals[key].minutes += minutes;
              totals[key].seconds += seconds;
              totals[key].count++;
            } else {
              // Parse value to a Number if it is "penaltyMinutes"
              if (key === 'penaltyMinutes') value = Number(value);
              totals[key] = (totals[key] || 0) + value;
            }
          }
        });
        return totals;
      }, {});
  
      const totalPlayers = team.length;
      const statAverages = Object.entries(statTotals).reduce((averages, [key, value]) => {
        // Check if the stat is a time format
        if (key === 'timeOnIcePerGame' || key === 'totalTimeOnIce') {
          let avgMinutes = Math.floor(value.minutes / value.count);
          let avgSeconds = Math.floor(value.seconds / value.count);
          // Adjust the seconds and minutes if the average seconds is over 60
          if (avgSeconds >= 60) {
            avgMinutes += Math.floor(avgSeconds / 60);
            avgSeconds = avgSeconds % 60;
          }
          averages[key] = `${avgMinutes}:${avgSeconds < 10 ? '0' + avgSeconds : avgSeconds}`;
        } else {
          averages[key] = value / totalPlayers;
        }
        return averages;
      }, {});
  
      setStatAverages(statAverages);
    };

    const calculateTotals = () => {
      const statTotals = team.reduce((totals, player) => {
        Object.entries(player).forEach(([key, value]) => {
          if (key !== 'name' && key !== 'img' && key !== 'team' && key !== 'id' && !excludedStats.includes(key)) {
            // Check if the stat is a time format
            if (key === 'timeOnIcePerGame' || key === 'totalTimeOnIce') {
              let [minutes, seconds] = value.split(":").map(Number);
              if (!totals[key]) {
                totals[key] = {minutes: 0, seconds: 0};
              }
              totals[key].minutes += minutes;
              totals[key].seconds += seconds;
            } else {
              // Parse value to a Number if it is "penaltyMinutes"
              if (key === 'penaltyMinutes') value = Number(value);
              totals[key] = (totals[key] || 0) + value;
            }
          }
        });
        return totals;
      }, {});
  
      // Converting the total seconds into minute:second format for 'timeOnIcePerGame' and 'totalTimeOnIce'
      Object.entries(statTotals).forEach(([key, value]) => {
        if (key === 'timeOnIcePerGame' || key === 'totalTimeOnIce') {
          let totalMinutes = Math.floor(value.seconds / 60);
          let totalSeconds = value.seconds % 60;
          statTotals[key] = `${value.minutes + totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
        }
      });

      setStatAverages(statTotals);
    };

    // Switch between average and total stats based on 'statMode'
    if (statMode === "average") {
      calculateAverages();
    } else {
      calculateTotals();
    }
  }, [team, statMode]);


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length > 0) {
      const suggestions = filteredPlayers.slice(0, 3);
      setSuggestedPlayers(suggestions);
    } else {
      setSuggestedPlayers([]);
    }
  };

  const getShortForm = (longForm) => {
    const statOption = statsOptions.find(option => option.longForm === longForm);
    return statOption ? statOption.shortForm : longForm;
  }

  const toggleChart = (statKey) => {
    setDisplayedStats(prevDisplayedStats => ({
      ...prevDisplayedStats,
      [statKey]: !prevDisplayedStats[statKey], // Toggle the stat's value
    }));
  };

  const camelToSentenceCase = (str) => {
    let sentence = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  const generateChart = (statKey) => {
    let statData;
    if (statKey === 'timeOnIcePerGame' || statKey === 'totalTimeOnIce') {
      statData = team.map(player => {
        let [minutes, seconds] = player[statKey].split(":").map(Number);
        return minutes * 60 + seconds; // convert to seconds
      });
    } else {
      statData = team.map(player => player[statKey]);
    }
    
    const playerNames = team.map(player => player.name);
  
    return (
      <div style={{maxWidth: '150px', maxHeight: '150px'}}>
        <Pie
          data={{
            labels: playerNames,
            datasets: [{
              data: statData,
              backgroundColor: ['#ff6384','#36a2eb','#cc65fe','#ffce56'],
            }]
          }}
          options={{
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="content">
      <div className="app-description3">
          <h2>
            This app allows you to calculate average and total stats for a team. Use the switch to swap between
            the two settings and the search bar to add players to your team. Clicking on each individual stat will
            show a pie chart comparing the players on the team for that specific stat. This tool is useful for gathering 
            information about the cumulative stat measurements for a full or partial roster.
          </h2>
        </div>
      <div className="sidebar">
        <h2>Team Stats:</h2>
        <div className="team-stats">
        {Object.entries(statAverages).filter(([key]) => !excludedStats.includes(key)).map(([key, value]) => (
  <div 
    className={`stat ${displayedStats[key] ? 'active' : ''}`} // If the chart is displayed, add 'active' class
    key={key}
    onClick={() => toggleChart(key)}
    onMouseEnter={() => {
      setHoverStatKey(key); // Set hoverStatKey when the mouse enters
      setHoverStatValue(value); // Set hoverStatValue when the mouse enters
    }}
    onMouseLeave={() => {
      setHoverStatKey(null); // Unset hoverStatKey when the mouse leaves
      setHoverStatValue(null); // Unset hoverStatValue when the mouse leaves
    }}
  >
    <div className={`stat-content ${hoverStatKey === key ? 'stat-hover' : ''}`}>
      <p>
        <span className="stat-name">
          {getShortForm(key)}:
        </span>
        <span className="stat-value"> 
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
      </p>
    </div>
    {displayedStats[key] && (
      <div className="chart-container">
        {generateChart(key)}
      </div>
    )}
  </div>
))}
</div>
    </div>
    <div className="toggle-stats">
    <div className="toggle-switch">
        <label className="switch">
            <input
                type="checkbox"
                checked={statMode === "average"}
                onChange={() => setStatMode(statMode === "average" ? "total" : "average")}
            />
            <span className="slider round"></span>
        </label>
        <span className="toggle-label">
            {statMode === "average" ? "Average Stats" : "Total Stats"}
        </span>
    </div>
</div>
    <div className="search-chart-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search players"
            value={searchValue}
            onChange={handleSearchChange}
          />
          {suggestedPlayers.length > 0 && (
            <div className="player-dropdown">
              {suggestedPlayers.map((player) => (
                <div key={player.id} className="player-option">
                  <div className="player-info">
                  <img
                    src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
                    alt={player.name}
                    className="player-image-small"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src=process.env.PUBLIC_URL + "/headshots/default.png";
                    }}
                  />
                    <span>{player.name}</span>
                  </div>
                  <div className="player-buttons">
                    <button onClick={() => addPlayer(player)}>Add to team</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="team-container">
        {team.map((player) => (
          <div key={player.id} className="player-card">
            <img
              src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
              alt={player.name}
              style={{ width: '100%', height: '200px' }}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src=process.env.PUBLIC_URL + "/headshots/default.png";
              }}
            />
            <h2>{player.name}</h2>
            <div className="player-card-stats">
            {Object.entries(player).filter(([key]) => !excludedStats.includes(key)).map(([key, value]) => {
              if (key !== 'name' && key !== 'img' && key !== 'team' && key !== 'id') {
                return (
                  <p key={key}>
                    {camelToSentenceCase(key)}: {value}
                  </p>
                );
              }
              return null;
            })}
          </div>
            <button onClick={() => removePlayer(player.id)}>Remove from team</button>
          </div>
        ))}
      </div>
    </div>
  );
};


const TradeAnalyzer = () => {
  const [players] = useState(playerData);
  const [search, setSearch] = useState('');
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // Initialize showDropdown as false
  const [averageStats, setAverageStats] = useState(false); // Initialize averageStats as false
  const chartRef = useRef(null); // Reference to the chart canvas element
  const [hoveredDataset, setHoveredDataset] = useState(null);

  const addPlayerToTeam = (team, playerToAdd) => {
    if (team === 1) {
      setTeam1((prevTeam1) => [...prevTeam1, playerToAdd]);
    } else if (team === 2) {
      setTeam2((prevTeam2) => [...prevTeam2, playerToAdd]);
    }
    setSearch(''); // Clear the search input after adding a player
    setShowDropdown(false); // Hide the dropdown after adding a player
  };

  const removePlayerFromTeam = (team, playerToRemove) => {
    if (team === 1) {
      setTeam1((prevTeam1) => prevTeam1.filter((player) => player !== playerToRemove));
    } else if (team === 2) {
      setTeam2((prevTeam2) => prevTeam2.filter((player) => player !== playerToRemove));
    }
    setShowDropdown(true); // Show the dropdown after removing a player
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
    setShowDropdown(true); // Show the dropdown when the user starts typing
  };

  const handlePlayerSelection = (player) => {
    addPlayerToTeam(1, player); // Add player to Team 1
  };

  const calculateTeamStats = (team, average = false) => {
    let stats = {
      Goals: 0,
      Assists: 0,
      Points: 0,
      PlusMinus: 0,
      PenaltyMinutes: 0,
      PowerplayGoals: 0,
      PowerplayPoints: 0,
      ShorthandedGoals: 0,
      ShorthandedPoints: 0,
      GameWinningGoals: 0,
      ShotsOnGoal: 0,
      ShootingPercentage: 0,
      FaceoffsWon: 0,
      Hits: 0,
      Blocks: 0,
      TimeOnIcePerGame: 0,
    };

    team.forEach((player) => {
      stats.Goals += player.goals;
      stats.Assists += player.assists;
      stats.Points += player.points;
      stats.PlusMinus += player.plusMinus;
      stats.PenaltyMinutes += parseInt(player.penaltyMinutes); // Parse penaltyMinutes as an integer
      stats.PowerplayGoals += player.powerplayGoals;
      stats.PowerplayPoints += player.powerplayPoints;
      stats.ShorthandedGoals += player.shorthandedGoals;
      stats.ShorthandedPoints += player.shorthandedPoints;
      stats.GameWinningGoals += player.gameWinningGoals;
      stats.ShotsOnGoal += player.shotsOnGoal;
      stats.FaceoffsWon += parseFloat(player.faceoffsWon); // Parse faceoffsWon as a float
      stats.Hits += player.hits;
      stats.Blocks += player.blocks;
    });

    if (average && team.length > 0) {
      stats.Goals /= team.length;
      stats.Assists /= team.length;
      stats.Points /= team.length;
      stats.PlusMinus /= team.length;
      stats.PenaltyMinutes /= team.length;
      stats.PowerplayGoals /= team.length;
      stats.PowerplayPoints /= team.length;
      stats.ShorthandedGoals /= team.length;
      stats.ShorthandedPoints /= team.length;
      stats.GameWinningGoals /= team.length;
      stats.ShotsOnGoal /= team.length;
      stats.FaceoffsWon /= team.length;
      stats.Hits /= team.length;
      stats.Blocks /= team.length;
    }

    // Calculate shooting percentage with 4 decimal places
    stats.ShootingPercentage = parseFloat((stats.Goals / stats.ShotsOnGoal * 100).toFixed(4));

    // Normalize time on ice per game
    if (team.length > 0) {
      const totalMinutes = team.reduce((total, player) => total + getTotalMinutes(player.timeOnIcePerGame), 0);
      stats.TimeOnIcePerGame = parseFloat((totalMinutes / team.length).toFixed(2));
    }

    if (average && team.length > 0) {
      stats.FaceoffsWon = parseFloat((stats.FaceoffsWon / team.length).toFixed(4));
    }

    return stats;
  };

  const getTotalMinutes = (time) => {
    const [minutes] = time.split(":");
    return parseInt(minutes);
  };

  const formatStatName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim(); // Add a space before each capital letter
  };

  const toggleAverageStats = () => {
    setAverageStats((prevState) => !prevState);
  };

  const team1Stats = calculateTeamStats(team1, averageStats);
  const team2Stats = calculateTeamStats(team2, averageStats);

  const chartData = {
    labels: Object.keys(team1Stats).map(formatStatName),
    datasets: [
      {
        label: 'Team 1 Total',
        data: Object.values(team1Stats),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      ...team1.map((player, index) => ({
        label: player.name,
        data: Object.values(calculateTeamStats([player])),
        backgroundColor: `rgba(54, 162, 235, ${0.3 - index * 0.2})`,
        borderColor: `rgba(54, 162, 235, 1)`,
        borderWidth: 1,
        stack: 'stack_team1',
      })),
      {
        label: 'Team 2 Total',
        data: Object.values(team2Stats),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      ...team2.map((player, index) => ({
        label: player.name,
        data: Object.values(calculateTeamStats([player])),
        backgroundColor: `rgba(255, 99, 132, ${0.3 - index * 0.2})`,
        borderColor: `rgba(255, 99, 132, 1)`,
        borderWidth: 1,
        stack: 'stack_team2',
      })),
    ],
  };

  useEffect(() => {
    const chartCanvas = chartRef.current.getContext('2d');
    if (chartCanvas) {
      const chart = new Chart(chartCanvas, {
        type: 'bar',
        data: chartData,
        options: {
          indexAxis: 'y',
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              mode: 'nearest',
              intersect: true,
            },
            legend: {
              onHover: function (event, legendItem) {
                document.getElementById("canvas").style.cursor = 'pointer';
              },
              onLeave: function() {
                document.getElementById("canvas").style.cursor = 'default';
              }
            },
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [team1, team2, averageStats]);

  const filteredPlayers = players
    .filter((player) => player.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 3); // Limit the number of options to 3

    
  return (
    <div className="TradeAnalyzer">
      <div className="app-description2">
          <h2>
            This app allows you to calculate and compare team stats for a prospective trade.
            Use the search bar to search and select players to add to both sides of a trade.
            The stats can be switched from <u>total team stats</u> to <u>average team stats using the switch</u>.
            This tool can be an excellent way to assess and analyze trade proposals. Do not be afraid to click on
            the chart legend to add and remove bars from the bar graph.
          </h2>
        </div>
      <div className="search-chart-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search players"
            value={search}
            onChange={handleSearchChange}
          />
          {showDropdown && ( // Conditionally render the dropdown
            <div className="player-dropdown">
              {filteredPlayers.map((player) => (
                <div key={player.id} className="player-option">
                  <div className="player-info">
                  <img
                    src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
                    onError={(e) => {e.target.onerror = null; e.target.src=process.env.PUBLIC_URL + "/headshots/default.png"}}
                    alt={player.name}
                    className="player-image-small"
                  />
                    <span>{player.name}</span>
                  </div>
                  <div className="player-buttons">
                    <button onClick={() => handlePlayerSelection(player)}>Team 1</button>
                    <button onClick={() => addPlayerToTeam(2, player)}>Team 2</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="chart-container">
        <canvas id="canvas" ref={chartRef} />
      </div>
      <div className="toggle-stats">
        <div className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={averageStats}
              onChange={toggleAverageStats}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">
            {averageStats ? "Average Stats" : "Total Stats"}
          </span>
        </div>
      </div>
      <div className="team-container">
        <div className="team-1-players">
          <h3>Team 1 Players</h3>
          {team1.map((player) => (
            <div key={player.id} className="player-profile">
              <img
                src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
                onError={(e) => {e.target.onerror = null; e.target.src=process.env.PUBLIC_URL + "/headshots/default.png"}}
                alt={player.name}
                className="player-image"
              />
              <h4>{player.name}</h4>
              <button onClick={() => removePlayerFromTeam(1, player)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="team-1">
          <h2>Team 1</h2>
          <div className="team-summary-stats">
            {Object.entries(team1Stats).map(([stat, value]) => (
              <p
                key={stat}
                className={`team-summary-stat ${
                  team1Stats[stat] > team2Stats[stat] ? 'higher-stat' : team1Stats[stat] < team2Stats[stat] ? 'lower-stat' : ''
                }`}
              >
                {`${formatStatName(stat)}: ${averageStats ? value.toFixed(2) : value}`}
              </p>
            ))}
          </div>
        </div>
        <div className="team-2">
          <h2>Team 2</h2>
          <div className="team-summary-stats">
            {Object.entries(team2Stats).map(([stat, value]) => (
              <p
                key={stat}
                className={`team-summary-stat ${
                  team1Stats[stat] < team2Stats[stat] ? 'higher-stat' : team1Stats[stat] > team2Stats[stat] ? 'lower-stat' : ''
                }`}
              >
                {`${formatStatName(stat)}: ${averageStats ? value.toFixed(2) : value}`}
              </p>
            ))}
          </div>
        </div>
        <div className="team-2-players">
          <h3>Team 2 Players</h3>
          {team2.map((player) => (
            <div key={player.id} className="player-profile">
              <img
                src={process.env.PUBLIC_URL + `/headshots/${player.team}/${player.img}`}
                onError={(e) => {e.target.onerror = null; e.target.src=process.env.PUBLIC_URL + "/headshots/default.png"}}
                alt={player.name}
                className="player-image"
              />
              <h4>{player.name}</h4>
              <button onClick={() => removePlayerFromTeam(2, player)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <div className="App">
      <header className="banner">
        <Link to="/" className="logo-link">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="logo-image" />
        </Link>
        <nav className="nav-links">
          <Link to="/fantasy" className="nav-link">Player Stat Rankings</Link>
          <Link to="/roster" className="nav-link">Roster Overview</Link>
          <Link to="/trade" className="nav-link">Trade Analyzer</Link>
        </nav>
      </header>
      <div className="content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/fantasy" element={<FantasyApp />} />
          <Route path="/roster" element={<RosterOverview />} />
          <Route path="/trade" element={<TradeAnalyzer />} />
        </Routes>
      </div>
    </div>
  </Router>
);

const PlayerStatsChart = ({ player, selectedStatLongForms, selectedStatShortForms }) => {
  const data = {
    labels: selectedStatShortForms,
    datasets: [
      {
        data: selectedStatLongForms.map(stat => player[stat]),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: '#2196F3',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#D8D8D8', // Color of radial lines
        },
        ticks: {
          beginAtZero: true,
          color: '#000000', // Text color for the radial scale tick labels
          font: {
            size: 8, // This controls the size of the tick labels
            weight: 'bold', // makes font bold
          },
        },
        pointLabels: {
          color: '#000000', // Text color for the labels around the edge of the radar chart
          font: {
            size: 14, // This controls the size of the labels around the edge of the radar chart
            weight: 'bold', // makes font bold
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend box
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default App;
