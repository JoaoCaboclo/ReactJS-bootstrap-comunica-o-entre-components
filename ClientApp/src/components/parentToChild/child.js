import React from 'react';

const Child = (props) => {
   return (
       <div>
            
            <button onClick={props.doWhatever}>{props.title}</button>
        </div>        
   )
}
export default Child;