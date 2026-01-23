//
//  NativeSwitchboardModuleProvider.m
//  SwitchboardGraphRunner
//
//  Created by Balazs Kiss on 2026. 01. 23..
//

#import "NativeSwitchboardModuleProvider.h"

#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/TurboModule.h>
#import "NativeSwitchboardModule.h"

@implementation NativeSwitchboardModuleProvider

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSwitchboardModule>(params.jsInvoker);
}

@end
