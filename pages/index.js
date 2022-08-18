import Head from 'next/head'
import { useEffect, useState } from 'react'
import useRemote from '../hooks/useRemote';

export default function Home() {
  const [username, setUsername] = useState('mozilla');
  return (
    <div className="container">
      <Head>
        <title>Github API : Fyle Assignment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='title'>Github User Search</h1>
      <UsernameForm onSubmit={setUsername} />
      <GithubProfile username={username} />
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

function UsernameForm({onSubmit}){
  const [username, setUsername] = useState('');
  const onChange = (e)=> setUsername(e.target.value);
  return (
  <form onSubmit={(e)=>{
    e.preventDefault();
    if(onSubmit) onSubmit(username);
  }} className='usernameform'>
  <label>
    Enter a username &nbsp;
    <input type='text' placeholder='John Doe' value={username} onChange={onChange}/>
  </label>
  <input type='submit' value='Go' />
  </form>
);
}

function GithubProfile({username}){
  // Get the profile directly from Github API to save load time,
  const [page, setPage] = useState(0);
  const [userData, userDataLoading, userDataError] = useRemote(`https://api.github.com/users/${username}`);
  const [repos, reposLoading, repoError] = useRemote(`https://nodeserverfyle.herokuapp.com?username=${username}&page=${page}`);
  const [total, totalLoading, totalError] = useRemote(`https://nodeserverfyle.herokuapp.com/size/${username}`);

  useEffect(() => setPage(0), [username]) // restart from page 0 on username change

  return (
    <div className='profile'>
      <User data={userData} loading={userDataLoading} error={userDataError} />
      <Repos repos={repos} loading={reposLoading} error={repoError} />
      <BreadCrumbs page={page} setPage={setPage} total={total} loading={totalLoading} error={totalError} />
    </div>
  )
}

function User({data, loading, error}){
  // incase error is true, pass ' ' as error message, so that we can stop showing
  // "loading..." without replacing it with another error string
  // (this error string will show in Repos - one place for it is enough)
  if(loading || error) return <Loader text="Profile is loading" height="50px" error={error && ' '} />
  const {avatar_url,  // to use as image's src
        html_url,     // the url to the repo
        name,         // full name
        location,     // geographical location
        email,        
        bio,
        twitter_username,
        blog          // url to the blog
        } = data;
  return (
    <div className='user'>
      <img src={avatar_url} alt={`${name}'s profile picture`} />
      <div>
      <h2>{name}</h2>
      {bio && <p>{bio}</p>}
      <address>
        {location && <span className='location'>{location}</span>}
        {blog && <span>Blog : <a href={blog}>{blog}</a></span>}
        {twitter_username && <span>Twitter : <a href={`https://www.twitter.com/${twitter_username}`}>{`https://www.twitter.com/${twitter_username}`}</a></span>}
        {email && <span className='email'>{email}</span>}
        <span>Github: <a href={html_url}>{html_url}</a></span>
      </address>
      </div>
    </div>
  )
}
function Repos({repos, loading, error}){
  if(loading || error) return <Loader height="500px" text="Repositories are loading" error={error}/>;
  
  return (<>
    {repos.map(
      (r) => <Repo key={r.url} name={r.name} url={r.url} description={r.description} topics={r.topics} />
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

function Repo({name, url, description, topics}){
  return (
    <div className='repo'>
        <a href={url}><h1>{name}</h1></a>
        <p>{description}</p>
        {topics.map(topic=><span className='tag' key={topic}>{topic}</span>)}
      </div>
  )
}

function Loader({text, height, error}){
  return <p className='loading' style={{height}}>
    {error ? error : text}
  </p>
}