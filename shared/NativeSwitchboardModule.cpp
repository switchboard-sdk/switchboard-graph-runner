#include "NativeSwitchboardModule.h"

namespace facebook::react {

NativeSwitchboardModule::NativeSwitchboardModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeSwitchboardModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeSwitchboardModule::processCommand(jsi::Runtime& rt, std::string command) {
    emitOnEventReceived(std::string("Test event from processCommand"));
    return std::string(command.rbegin(), command.rend());
}

} // namespace facebook::react