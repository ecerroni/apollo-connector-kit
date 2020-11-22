import React from 'react'

const Loading = ({ loadingMessage = '' }) => (
  <div className='spinnerWrapper'>
    <div className='spinner'>
      <style jsx global>{`
        .spinnerWrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          background-color: #45a2d9;

          border-radius: 100%;
          -webkit-animation: sk-scaleout 1s infinite ease-in-out;
          animation: sk-scaleout 1s infinite ease-in-out;
        }

        @-webkit-keyframes sk-scaleout {
          0% {
            -webkit-transform: scale(0);
          }
          100% {
            -webkit-transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes sk-scaleout {
          0% {
            -webkit-transform: scale(0);
            transform: scale(0);
          }
          100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
    <p
      style={{
        marginTop: -25,
        color: 'silver',
        fontSize: 12,
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        width: 200,
        left: 'calc(50% - 75px)',
      }}
    >
      {loadingMessage}
    </p>
  </div>
)

export default Loading
