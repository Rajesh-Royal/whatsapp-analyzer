import React from "react";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";
import Section from "@/components/dashboard/Section";


const ChatSummary: React.FC = () => {

  return (
    <Section>
      {/* <h1 className="text-4xl">{`${
        true
          ? "Lazy? Here's how we'd show your stats,"
          : `Showing chat between ${"common"}`
      }`}</h1> */}
      {true ? (
        <h3 className="text-3xl ">
          Showing
          {/* <span className="bg-lime-300 px-1">
            example
          </span> */}
           {" "}chat between Common
        </h3>
      ) : (
        ""
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-5">
        <div className="tile is-parent">
          <ChatStatsBox
            title={"Total Days"}
            stats={"100"}
            iconName="calendar"
          />
        </div>
        <div className="tile is-parent">
          <ChatStatsBox
            title="Total Message Exchanged"
            stats={"context.file.stats.summary.totalMessageExchanged"}
            iconName="message-square"
          />
        </div>
        <div className="tile is-parent">
          <ChatStatsBox
            title={"Total Words Sent"}
            stats={"summary.totalWords"}
            iconName="send"
          />
        </div>
        <div className="tile is-parent">
          <ChatStatsBox
            title={"Total Media Sent"}
            stats={"summary.totalMedia"}
            iconName="clapperboard"
          />
        </div>
      </div>
    </Section>
  );
}

export default ChatSummary;
