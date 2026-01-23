#include "NativeSwitchboardModule.h"

namespace facebook::react
{
    NativeSwitchboardModule::NativeSwitchboardModule(std::shared_ptr<CallInvoker> jsInvoker)
        : NativeSwitchboardModuleCxxSpec(std::move(jsInvoker))
    {
        // Set up the event callback to emit events to JavaScript
        switchboard.setEventCallback([this](const std::string &event) {
            // Emit the event to JavaScript
            emitOnEventReceived(event);
        });
    }

    std::string NativeSwitchboardModule::processCommand(jsi::Runtime &rt, std::string command)
    {
        // Process the command using the SwitchboardJSONRPC instance
        const std::string response = switchboard.processCommand(command);

        return response;
    }

} // namespace facebook::react
