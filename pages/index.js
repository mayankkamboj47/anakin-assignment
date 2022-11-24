import Head from 'next/head'
import { useEffect, useState } from 'react'
import useRemote from '../hooks/useRemote';

export default function Home() {
  const [profileRepo, setProfileRepo] = useState('11ty/eleventy');
  return (
    <div className="container">
      <Head>
        <title>Github Issue Navigator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='title'>Github Issue Navigator</h1>
      <ProfileRepoSetter onSubmit={setProfileRepo} />
      <IssueList profileRepo={profileRepo} />
      <footer>
        <a
          href="https://mayankkamboj47.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by &nbsp; <strong>Mayank Kamboj</strong>
        </a>
      </footer>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          max-width:1000px;
          margin : 0 auto;
        }



        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .tag{
          margin:0 1;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        address > * {
          display : block;
        }

        .user { 
          display : flex;
          gap : 3rem;
          min-height:10rem;
        }

        .user img{
          max-height : 10rem;
          min-width  : 10rem;
          background : gray;
        }

        .tag{
          background : black;
          color : white;
          margin : 0 1rem;
          display:inline-block;
          padding:0.2rem 0.5rem;
        }

        .tag:first-of-type{
          margin-left:0;
        }

        .breadcrumb {
          font-weight : bold;
          margin-right:1rem; 
        }        

        .breadcrumbs{
          margin-top : 3rem;
        }

        .profile{
          margin-top : 1rem;
        }

        .usernameform{
          margin-top : 1rem;
        }

        .loading{
          animation:background-shift 3s infinite alternate;
          display : flex;
          align-items:center;
          justify-content:center;
        }

        @keyframes background-shift{
          from{
            background-color:whitesmoke;
          }
          to {
            background-color:gray;
          }
        }
      `}</style>
    </div>
  )
}

function ProfileRepoSetter({onSubmit}){
  const [profileRepo, setProfileRepo] = useState('');
  const onChange = (e)=> setProfileRepo(e.target.value);
  return (
  <form onSubmit={(e)=>{
    e.preventDefault();
    if(onSubmit) onSubmit(profileRepo);
  }} className='usernameform'>
  <label>
    Enter a repo in the format 'username/repo' &nbsp;
    <input type='text' placeholder='11ty/eleventy' value={profileRepo} onChange={onChange}/>
  </label>
  <input type='submit' value='Go' />
  </form>
);
}

function IssueList({profileRepo}){
  // Get the profile directly from Github API to save load time,
  const [page, setPage] = useState(0);
  const [issues, issueDataLoading, issueDataError] = useRemote(`https://api.github.com/repos/${profileRepo}/issues`);

  useEffect(() => setPage(0), [profileRepo]) // restart from page 0 on username change

  return (
    <div className='profile'>
      <Issues issues={issues?.slice(10*page, 10*(page+1))} loading={issueDataLoading} error={issueDataError} />
      <BreadCrumbs page={page} setPage={setPage} total={issues?.length} loading={issueDataLoading} error={issueDataError} />
    </div>
  );
}

function Issues({issues, loading, error}){
  if(loading || error) return <Loader height="1000px" text="Issues are loading" error={error}/>;
  console.log("Issues", issues);
  return (<>
    {issues.map(
      (r) => <Issue key={r.url} title={r.title} url={r.url} number={r.number} topics={r.labels} />
      )
    }
  </>);
}
function BreadCrumbs({page, setPage, total=0, loading, error}){
  if(loading || error) return <Loader height="2rem" />;
  const pageSize = 10;
  if(typeof total !== 'number') return null;
  const breadCrumbCount = Math.ceil(total/pageSize);
  return (<div className='breadcrumbs'>
    <input type='button' value='Prev' disabled={page==0} className='breadcrumb' onClick={()=>setPage(page-1)} />
    {
    (Array(Math.ceil(breadCrumbCount)).fill(true).map((_,i)=>{
    // i shouldn't set key=i, but for now I will
    return <input type='button' onClick={setPage.bind(null, i)} key={i} className='breadcrumb' disabled={i===page} value={i} />
  }))}
  <input type='button' value='Next' disabled={page + 1 === breadCrumbCount || breadCrumbCount===0} onClick={()=>setPage(page+1)}/>
  </div>
  );
}

function Issue({title, url, number, topics}){
  console.log(title, url, number, topics);
  return (
    <div className='repo'>
        <a href={url}><h1>{title}</h1></a>
        <p>{number}</p> {/** A <p> ? You can remove this, and add something clearer */}
        {topics.map(topic=><span className='tag' key={topic.name}>{topic.name}</span>)}
      </div>
  )
}

function Loader({text, height, error}){
  return <p className='loading' style={{height}}>
    {error ? error : text}
  </p>
}